"use client"

import { useEffect, useRef, useState } from "react"

import {
  setGlobalChatContext,
  useChatWithTools,
} from "@/hooks/use-chat-with-tools"

import { ContactChatMessage } from "@/components/app/contact-chat-message"
import { ContactSuggestedPrompts } from "@/components/app/contact-suggeted-prompts"
import { ContactChatBotErrorMessage } from "@/components/app/contact-chat-bot-error-message"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ContactChatBot() {
  const chatContext = useChatWithTools()
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    error,
  } = chatContext

  useEffect(() => {
    setGlobalChatContext(chatContext)
  }, [chatContext])

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    if (error) {
      console.error("Chat error:", error)
      setHasError(true)
      setErrorMessage(
        error.message ||
          "An error occurred with the chat service. Please try again."
      )
    } else {
      setHasError(false)
      setErrorMessage("")
    }
  }, [error])

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    try {
      handleSubmit(e)

      // NOTE: Refocus the input after submission
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim()) {
      e.preventDefault()
      handleFormSubmit(e)
    }
  }

  return (
    <Card className="bg-background/40 flex h-[600px] w-full flex-col overflow-hidden rounded-lg border backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ContactChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="bg-muted/50 flex w-fit max-w-[80%] items-center space-x-2 rounded-lg p-3">
            <Icons.spinner className="h-4 w-4 animate-spin" />
            <p className="animate-text-gradient font-base inline-flex bg-gradient-to-r from-[#535353] via-[#c9c9c9] to-[#535353] bg-[200%_auto] bg-clip-text text-center text-xs text-transparent dark:from-[#ACACAC] dark:via-[#363636] dark:to-[#ACACAC]">
              Thinking...
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showSuggestions && messages.length === 1 && (
        <ContactSuggestedPrompts onSuggestionClick={handleSuggestionClick} />
      )}

      <div className="border-t p-4">
        {hasError && (
          <div className="mb-2 flex justify-center">
            <ContactChatBotErrorMessage message={errorMessage} />
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading || hasError}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || hasError || !input.trim()}
          >
            <Icons.send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
