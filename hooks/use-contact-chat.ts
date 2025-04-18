"use client"

import { useEffect, useRef, useState } from "react"

import { useChatWithTools } from "@/hooks/use-chat-with-tools"

export function useContactChat() {
  const chatContext = useChatWithTools()
  const {
    messages,
    error,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = chatContext

  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep input focused across all situations
  useEffect(() => {
    // Small delay to ensure DOM is ready and any operations are complete
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(focusTimer)
  }, [messages, isLoading, isCancelling])

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // If currently cancelling, don't submit
    if (isCancelling) return

    // If we're loading (streaming a response) and user sends a message,
    // interrupt the current stream and cancel any pending tool calls
    if (isLoading) {
      setIsCancelling(true)

      // First stop the streaming response
      stop()

      // Then cancel any pending tool calls and reset context
      chatContext.cancelToolCall()

      // Reset cancelling state after a short delay
      setTimeout(() => {
        setIsCancelling(false)
        // Focus the input after cancellation
        inputRef.current?.focus()
      }, 500)

      return
    }

    // Only submit if input is not empty
    if (input.trim()) {
      handleSubmit(e)
      // Hide suggestions after first user message
      setShowSuggestions(false)
    }
  }

  // Monitor for scrolling to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll to bottom whenever messages change
  if (typeof window !== "undefined" && messages.length > 0) {
    setTimeout(scrollToBottom, 100)
  }

  // Handle keydown events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Submit form on Shift+Enter
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        const fakeEvent = {
          preventDefault: () => {},
        } as React.FormEvent<HTMLFormElement>
        handleFormSubmit(fakeEvent)
      }
    }
  }

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    if (inputRef.current) {
      inputRef.current.value = suggestion
      const event = {
        target: inputRef.current,
      } as React.ChangeEvent<HTMLInputElement>
      handleInputChange(event)

      // Focus the input after selecting a suggestion
      inputRef.current.focus()
    }
  }

  return {
    chatContext,
    messages,
    hasError: !!error,
    errorMessage: error?.message || "Something went wrong",
    isLoading,
    isCancelling,
    showSuggestions,
    handleSuggestionClick,
    messagesEndRef,
    input,
    handleInputChange,
    inputRef,
    handleFormSubmit,
    handleKeyDown,
  }
}
