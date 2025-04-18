import { useChat as useAIChat } from "@ai-sdk/react"
import type { Message } from "ai"

// Extended message type that includes toolCalls property
interface MessageWithToolCalls extends Message {
  toolCalls?: Array<{
    toolCallId: string
    state: string
    [key: string]: unknown
  }>
}

/**
 * Custom hook that extends useChat with safe tool result handling
 */
export function useChatWithTools() {
  const chatState = useAIChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "You can ask me anything, I'm here for your service!",
      },
    ],
  })

  /**
   * Safely adds a tool result to the chat
   * Falls back to appending a new message if direct tool result fails
   */
  const safeAddToolResult = (params: {
    toolCallId: string
    result: string | Record<string, unknown>
  }) => {
    try {
      // Try to add the result directly
      chatState.addToolResult(params)
    } catch (error) {
      console.error("Error adding tool result:", error)

      // If that fails, create a new message to handle the result
      const toolResultMsg: Message = {
        id: `tool-result-${Date.now()}`,
        role: "assistant",
        content:
          "I've processed your request. Let me know if you need anything else!",
      }

      // Add the new message
      chatState.append(toolResultMsg)
    }
  }

  /**
   * Cancels any pending tool calls and resets the conversation context
   * Creates a new assistant message that clearly ends the previous topic
   * and signals to the model to stop using tools from that context
   */
  const cancelToolCall = () => {
    try {
      // Get the last message
      const lastMessage = chatState.messages[
        chatState.messages.length - 1
      ] as MessageWithToolCalls

      // Safety check - ensure the message exists and has toolCalls property
      if (!lastMessage) {
        console.warn("No messages found to cancel tool calls")
        return
      }

      // Check if there are any pending tool calls
      const hasPendingToolCalls =
        lastMessage.toolCalls?.some((toolCall) => toolCall.state === "call") ??
        false

      // Even if no pending tool calls, we'll add a context reset message
      // to ensure the conversation moves to a new topic

      // Create a context reset message that clearly indicates topic change
      const resetMsg: Message = {
        id: `context-reset-${Date.now()}`,
        role: "assistant",
        content:
          "I understand you want to change the topic. Let's start fresh. How can I help you now?",
      }

      // Add the reset message to clearly change context
      chatState.append(resetMsg)

      // Log the context reset
      console.log(
        hasPendingToolCalls
          ? "Cancelled pending tool calls and reset context"
          : "Reset conversation context"
      )

      // Add a user-invisible system message that tells the model to stop using tools
      // from the previous context (this will be filtered out by sanitizeMessages)
      const systemHint: Message = {
        id: `system-hint-${Date.now()}`,
        role: "system",
        content:
          "The previous conversation thread has been reset. Previous tool calls were cancelled. Treat this as a new conversation context.",
      }

      // Add the system hint
      chatState.append(systemHint)
    } catch (error) {
      console.error("Error in cancelToolCall:", error)

      // Fallback reset message if error occurs
      const fallbackMsg: Message = {
        id: `fallback-reset-${Date.now()}`,
        role: "assistant",
        content: "Let's start a new conversation. How can I help you?",
      }

      chatState.append(fallbackMsg)
    }
  }

  return {
    ...chatState,
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
