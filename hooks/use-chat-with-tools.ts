import { useChat as useAIChat } from "@ai-sdk/react"
import type { Message } from "ai"

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

  return {
    ...chatState,
    addToolResult: safeAddToolResult,
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
