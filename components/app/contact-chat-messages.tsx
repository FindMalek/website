import { RefObject } from "react"
import { Message } from "ai"

import { ContactChatMessage } from "@/components/app/contact-chat-message"
import { Icons } from "@/components/shared/icons"

interface ContactChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  isCancelling: boolean
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export function ContactChatMessages({
  messages,
  isLoading,
  isCancelling,
  messagesEndRef,
}: ContactChatMessagesProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <ContactChatMessage key={message.id} message={message} />
      ))}
      {(isLoading || isCancelling) && (
        <div className="bg-muted/50 flex w-fit max-w-[80%] items-center space-x-2 rounded-lg p-3">
          <Icons.spinner className="h-4 w-4 animate-spin" />
          <p className="animate-text-gradient font-base inline-flex bg-gradient-to-r from-[#535353] via-[#c9c9c9] to-[#535353] bg-[200%_auto] bg-clip-text text-center text-xs text-transparent dark:from-[#ACACAC] dark:via-[#363636] dark:to-[#ACACAC]">
            Thinking...
          </p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
