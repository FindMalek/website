"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "ai/react"
import { Loader2, Send } from "lucide-react"

import { ContactChatMessage } from "@/components/app/contact-chat-message"
import { ContactSuggestedPrompts } from "@/components/app/contact-suggeted-prompts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ContactChatBot() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "You can ask me anything, I'm here for your service!",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

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

  return (
    <Card className="flex h-[600px] w-full flex-col overflow-hidden rounded-lg border bg-background/20 backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ContactChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="bg-muted/50 flex w-fit max-w-[80%] items-center space-x-2 rounded-lg p-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm">Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showSuggestions && messages.length === 1 && (
        <ContactSuggestedPrompts onSuggestionClick={handleSuggestionClick} />
      )}

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
