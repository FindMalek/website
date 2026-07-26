import { ChangeEvent, useState } from "react"
import { useChat as useAIChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"

import { PageContext } from "@/types"

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome-message",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "👋 Welcome! I'm here to help you connect with the Malek. I can:\n\n- Save your contact information for follow-up\n- Schedule a meeting at a convenient time\n- Generate a pricing estimate for your project\n- Provide access to the owner's resume/CV\n\nHow can I assist you today?",
    },
  ],
}

function textMessage(id: string, role: "assistant" | "system", text: string): UIMessage {
  return { id, role, parts: [{ type: "text", text }] }
}

/**
 * Custom hook that extends useChat with safe tool result handling.
 *
 * v5's useChat no longer manages input state or exposes a boolean
 * `isLoading`, so both are rebuilt here to keep the rest of the app's
 * v4-shaped consumers (use-contact-chat.ts, the tool hooks) unchanged.
 *
 * @param pageContext - what the visitor is currently looking at (route,
 * scroll section, or case-study slug); re-evaluated by the caller on every
 * render, so it's always current at send-time, not just at mount.
 */
export function useChatWithTools(pageContext?: PageContext) {
  const chatState = useAIChat({
    messages: [WELCOME_MESSAGE],
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const [input, setInput] = useState("")

  const isLoading =
    chatState.status === "submitted" || chatState.status === "streaming"

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.()
    if (!input.trim()) return
    chatState.sendMessage({ text: input }, { body: { pageContext } })
    setInput("")
  }

  /**
   * Safely adds a tool result to the chat.
   * Falls back to appending a new message if direct tool result fails.
   */
  const safeAddToolResult = (params: {
    toolCallId: string
    tool: string
    result: Record<string, unknown>
  }) => {
    try {
      chatState.addToolResult({
        tool: params.tool,
        toolCallId: params.toolCallId,
        output: params.result,
      })
    } catch (error) {
      console.error("Error adding tool result:", error)

      chatState.setMessages((prev) => [
        ...prev,
        textMessage(
          `tool-result-${Date.now()}`,
          "assistant",
          "I've processed your request. Let me know if you need anything else!"
        ),
      ])
    }
  }

  /**
   * Cancels any pending tool calls and resets the conversation context.
   * Appends synthetic messages directly to local state (no API round-trip)
   * that clearly end the previous topic and signal the model to stop using
   * tools from that context.
   */
  const cancelToolCall = () => {
    try {
      const lastMessage = chatState.messages[chatState.messages.length - 1]

      if (!lastMessage) {
        console.warn("No messages found to cancel tool calls")
        return
      }

      const hasPendingToolCalls = lastMessage.parts.some(
        (part) =>
          part.type.startsWith("tool-") &&
          "state" in part &&
          (part.state === "input-streaming" || part.state === "input-available")
      )

      const resetMsg = textMessage(
        `context-reset-${Date.now()}`,
        "assistant",
        "I understand you want to change the topic. Let's start fresh. How can I help you now?"
      )

      const systemHint = textMessage(
        `system-hint-${Date.now()}`,
        "system",
        "The previous conversation thread has been reset. Previous tool calls were cancelled. Treat this as a new conversation context."
      )

      chatState.setMessages((prev) => [...prev, resetMsg, systemHint])

      console.log(
        hasPendingToolCalls
          ? "Cancelled pending tool calls and reset context"
          : "Reset conversation context"
      )
    } catch (error) {
      console.error("Error in cancelToolCall:", error)

      chatState.setMessages((prev) => [
        ...prev,
        textMessage(
          `fallback-reset-${Date.now()}`,
          "assistant",
          "Let's start a new conversation. How can I help you?"
        ),
      ])
    }
  }

  return {
    ...chatState,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    addToolResult: safeAddToolResult,
    cancelToolCall,
  }
}

// Singleton pattern for global chat context
let globalChatContext: ReturnType<typeof useChatWithTools> | null = null

/**
 * Sets the global chat context instance
 */
export function setGlobalChatContext(
  context: ReturnType<typeof useChatWithTools>
) {
  globalChatContext = context
}

/**
 * Gets the global chat context instance
 * @throws Error if context is not initialized
 */
export function getGlobalChatContext() {
  if (!globalChatContext) {
    throw new Error("Chat context not initialized")
  }
  return globalChatContext
}
