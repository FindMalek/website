"use client"

import { useEffect } from "react"

import { setGlobalChatContext } from "@/hooks/use-chat-with-tools"
import { useContactChat } from "@/hooks/use-contact-chat"

import { ContactChatBotErrorMessage } from "@/components/app/contact-chat-bot-error-message"
import { ContactChatInput } from "@/components/app/contact-chat-input"
import { ContactChatMessages } from "@/components/app/contact-chat-messages"
import { ContactSuggestedPrompts } from "@/components/app/contact-suggeted-prompts"
import { Card } from "@/components/ui/card"

export function ContactChatBot() {
  const {
    chatContext,
    messages,
    hasError,
    errorMessage,
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
  } = useContactChat()

  useEffect(() => {
    setGlobalChatContext(chatContext)
  }, [chatContext])

  const chatContextForInput = {
    input,
    handleInputChange,
    inputRef,
    handleFormSubmit,
    handleKeyDown,
  }

  return (
    <Card className="bg-background/40 flex h-[600px] w-full flex-col overflow-hidden rounded-lg border backdrop-blur-sm">
      <div className="flex min-h-0 flex-1 flex-col">
        <ContactChatMessages
          messages={messages}
          isLoading={isLoading}
          isCancelling={isCancelling}
          messagesEndRef={messagesEndRef}
        />

        {showSuggestions && messages.length === 1 && (
          <ContactSuggestedPrompts onSuggestionClick={handleSuggestionClick} />
        )}
      </div>

      <div className="flex-shrink-0 border-t p-4">
        {hasError && (
          <div className="mb-2 flex justify-center">
            <ContactChatBotErrorMessage message={errorMessage} />
          </div>
        )}
        <ContactChatInput
          chatContext={chatContextForInput}
          isLoading={isLoading}
          isCancelling={isCancelling}
        />
      </div>
    </Card>
  )
}
