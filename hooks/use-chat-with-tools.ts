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
   * Cancels any pending tool calls
   * Instead of trying to add results to existing tool calls,
   * this creates a new assistant message that replaces the pending tool call
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

      if (
        !lastMessage.toolCalls ||
        !Array.isArray(lastMessage.toolCalls) ||
        lastMessage.toolCalls.length === 0
      ) {
        console.warn("No tool calls found in the last message")
        return
      }

      // Find all pending tool calls
      const pendingToolCalls = lastMessage.toolCalls.filter(
        (toolCall) => toolCall.state === "call"
      )

      if (pendingToolCalls.length === 0) {
        console.warn("No pending tool calls to cancel")
        return
      }

      console.log(`Cancelling ${pendingToolCalls.length} pending tool calls`)

      // IMPORTANT: Instead of trying to add results to each tool call,
      // we'll create a new assistant message that replaces the pending one
      // This ensures clean message history for the next user message
      try {
        // Create a transitional message
        const transitionMsg: Message = {
          id: `transition-${Date.now()}`,
          role: "assistant",
          content: "Let's move on. What else can I help you with?",
        }

        // Add the new message - this will appear in the chat
        chatState.append(transitionMsg)

        console.log(
          "Successfully added transition message for cancelled tool calls"
        )
      } catch (error) {
        console.error("Error adding transition message:", error)

        // As a fallback, try to add results to each tool call
        try {
          pendingToolCalls.forEach((toolCall) => {
            if (toolCall.toolCallId) {
              chatState.addToolResult({
                toolCallId: toolCall.toolCallId,
                result: {
                  status: "cancelled",
                  message: "User cancelled this action",
                  timestamp: new Date().toISOString(),
                },
              })
            }
          })
        } catch (fallbackError) {
          console.error(
            "Fallback error when cancelling tool calls:",
            fallbackError
          )
        }
      }
    } catch (error) {
      console.error("General error in cancelToolCall:", error)
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
