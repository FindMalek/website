"use client"

import { useEffect, useRef, useState } from "react"
import { useChatDock } from "@/providers/chat-provider"

import { MAX_MESSAGES_ALLOWED } from "@/config/consts"

/**
 * Reads the single shared chat instance from ChatProvider instead of
 * calling useChatWithTools() itself. Calling it again here would spin up a
 * second, disconnected useChat instance -- messages sent from this hook's
 * UI would land in a state nobody else (dock-open logic, the tool-result
 * hooks reading getGlobalChatContext()) ever looks at, so the request would
 * succeed but the UI would never visibly update.
 */
export function useContactChat() {
  const { chat: chatContext } = useChatDock()
  const { messages, error, input, handleInputChange, isLoading, stop } =
    chatContext

  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const isMessageLimitReached = messages.length >= MAX_MESSAGES_ALLOWED

  // Keep input focused across all situations
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      if (inputRef.current && !isMessageLimitReached) {
        inputRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(focusTimer)
  }, [messages, isLoading, isCancelling, isMessageLimitReached])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isMessageLimitReached) return
    if (isCancelling) return

    // If we're loading (streaming a response) and user sends a message,
    // interrupt the current stream and cancel any pending tool calls
    if (isLoading) {
      setIsCancelling(true)
      stop()
      chatContext.cancelToolCall()

      setTimeout(() => {
        setIsCancelling(false)
        inputRef.current?.focus()
      }, 500)

      return
    }

    if (input.trim()) {
      chatContext.handleSubmit(e)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLTextAreaElement>)
    inputRef.current?.focus()
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
    input,
    handleInputChange,
    inputRef,
    handleFormSubmit,
    isMessageLimitReached,
  }
}
