import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ToolInvocation } from "ai"
import { useForm } from "react-hook-form"

import { emailFormSchema, type EmailFormValues } from "@/config/schemas"
import { createToolResult, stringifyToolResult } from "@/lib/tool-helpers"
import { getGlobalChatContext } from "@/hooks/use-chat-with-tools"

import { sendContactEmailIntroduction } from "@/actions/resend"

interface EmailFormState {
  askingDetails: boolean
  askingConfirmation: boolean
  isSubmitting: boolean
  isSubmitted: boolean
}

export function useEmailForm(toolCall: ToolInvocation) {
  const [state, setState] = useState<EmailFormState>({
    askingDetails: true,
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
  const { addToolResult, messages } = getGlobalChatContext()

  // Helper function to update a single property in state
  const updateState = <K extends keyof EmailFormState>(
    key: K,
    value: EmailFormState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Move to confirmation step
  const moveToConfirmationStep = async () => {
    try {
      const isValid = await form.trigger(["name", "email", "message"])
      if (isValid) {
        updateState("askingDetails", false)
        updateState("askingConfirmation", true)
      }
    } catch (error) {
      console.error("Error in moveToConfirmationStep:", error)
    }
  }

  // Submit the email
  const submitEmail = async (values: EmailFormValues) => {
    updateState("isSubmitting", true)

    try {
      // Get the conversation history
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        message: msg.content,
      }))

      const result = await sendContactEmailIntroduction(
        values.email,
        values.name,
        values.message,
        conversationHistory
      )

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
    moveToConfirmationStep,
    submitEmail,
  }
}
