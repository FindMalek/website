import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ToolInvocation } from "ai"
import { useForm } from "react-hook-form"

import { emailFormSchema, type EmailFormValues } from "@/config/schemas"
import { createToolResult, stringifyToolResult } from "@/lib/tool-helpers"
import { getGlobalChatContext } from "@/hooks/use-chat-with-tools"

interface EmailFormState {
  askingPurpose: boolean
  askingDetails: boolean
  askingConfirmation: boolean
  isSubmitting: boolean
  isSubmitted: boolean
}

export function useEmailForm(toolCall: ToolInvocation) {
  const [state, setState] = useState<EmailFormState>({
    askingPurpose: true,
    askingDetails: false,
    askingConfirmation: false,
    isSubmitting: false,
    isSubmitted: false,
  })

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  // Get the global chat context
  const {
    addToolResult,
    messages,
    setInput,
    handleSubmit: chatSubmit,
  } = getGlobalChatContext()

  // Helper function to update a single property in state
  const updateState = <K extends keyof EmailFormState>(
    key: K,
    value: EmailFormState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Ask about the purpose
  const askForPurpose = () => {
    if (state.askingPurpose) {
      setInput("What would you like to contact me about?")
      chatSubmit()
    }
  }

  // Move to details step
  const moveToDetailsStep = () => {
    updateState("askingPurpose", false)
    updateState("askingDetails", true)

    // Extract the purpose from the conversation
    const userMessages = messages.filter((msg) => msg.role === "user")
    if (userMessages.length > 0) {
      form.setValue("message", userMessages[userMessages.length - 1].content)
    }
  }

  // Move to confirmation step
  const moveToConfirmationStep = async () => {
    const isValid = await form.trigger(["name", "email"])
    if (isValid) {
      updateState("askingDetails", false)
      updateState("askingConfirmation", true)
    }
  }

  // Submit the email
  const submitEmail = async (values: EmailFormValues) => {
    updateState("isSubmitting", true)

    try {
      // Get the conversation history
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          name: values.name,
          message: values.message,
          conversation: conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      const result = await response.json()

      updateState("isSubmitted", true)

      // Create and submit tool result
      const toolResult = createToolResult(true, {
        email: values.email,
        name: values.name,
        ownerEmailSent: result.ownerEmailSent,
        userEmailSent: result.userEmailSent,
      })

      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: stringifyToolResult(toolResult),
      })
    } catch (error) {
      console.error("Error sending email:", error)

      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: stringifyToolResult(
          createToolResult(false, {
            error: "Failed to send email",
          })
        ),
      })
    } finally {
      updateState("isSubmitting", false)
    }
  }

  return {
    form,
    state,
    updateState,
    askForPurpose,
    moveToDetailsStep,
    moveToConfirmationStep,
    submitEmail,
  }
}
