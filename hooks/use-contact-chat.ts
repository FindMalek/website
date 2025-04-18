import { useEffect, useRef, useState } from "react"

import { useChatWithTools } from "@/hooks/use-chat-with-tools"

export function useContactChat() {
  const chatContext = useChatWithTools()
  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    setInput,
    error,
    cancelToolCall,
    append,
  } = chatContext

  const isRetryingRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  // Function to handle message retry after error
  const handleRetry = () => {
    if (!isRetryingRef.current && input.trim()) {
      // Mark that we're retrying to prevent multiple retries
      isRetryingRef.current = true

      // Get the current input value and submit it
      const currentInput = input.trim()

      // Reset retry flag after some time, regardless of the outcome
      setTimeout(() => {
        isRetryingRef.current = false
      }, 3000)

      // Submit the message
      submitMessage(currentInput).catch((err) => {
        console.error("Error retrying message:", err)
      })
    }
  }

  useEffect(() => {
    if (error) {
      console.error("Chat error:", error)

      // Check if error is about tool invocation without result
      if (error.message?.includes("ToolInvocation must have a result")) {
        setHasError(true)
        setErrorMessage(
          "Previous action wasn't completed. Please try sending your message again."
        )

        // Auto-retry after a delay if we're not already retrying
        if (!isRetryingRef.current) {
          console.log("Setting up auto-retry...")
          setTimeout(() => {
            handleRetry()
          }, 2000)
        }
      } else {
        // General error
        setHasError(true)
        setErrorMessage(
          error.message ||
            "An error occurred with the chat service. Please try again."
        )
      }
    } else {
      setHasError(false)
      setErrorMessage("")
    }
  }, [error, input]) // Only depend on error and input, not on retrying state

  useEffect(() => {
    inputRef.current?.focus()
  }, [messages, isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
  }

  // Create a new submission function that doesn't rely on the form event
  const submitMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    try {
      // Create a user message manually
      await append({
        role: "user",
        content: messageText,
      })

      // Clear the input field
      setInput("")

      // Focus the input for the next message
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    } catch (err) {
      console.error("Error submitting message:", err)
      setHasError(true)
      setErrorMessage(
        "Failed to send message. Please try again or reload the page."
      )
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)

    const currentInput = input.trim()
    if (!currentInput) return

    try {
      // Always cancel any pending tool calls to be safe
      setIsCancelling(true)

      try {
        // Try to cancel tool calls
        cancelToolCall()

        // Small delay to ensure cancellation is processed
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (cancelError) {
        console.error("Error during tool call cancellation:", cancelError)
      } finally {
        setIsCancelling(false)
      }

      // Now submit the new message
      await submitMessage(currentInput)
    } catch (err) {
      console.error("Error in form submission:", err)
      setHasError(true)
      setErrorMessage(
        "Failed to send message. Please try again or reload the page."
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim()) {
      e.preventDefault()
      handleFormSubmit(e)
    }
  }

  return {
    chatContext,
    messages,
    input,
    handleInputChange,
    isLoading,
    hasError,
    errorMessage,
    showSuggestions,
    isCancelling,
    inputRef,
    messagesEndRef,
    handleSuggestionClick,
    handleFormSubmit,
    handleKeyDown,
    submitMessage,
  }
}
