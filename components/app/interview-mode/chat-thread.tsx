import { forwardRef } from "react"
import { CONTACT_EMAIL } from "@/data/journey"
import type { UIMessage } from "ai"

import { ContactChatMessage } from "@/components/app/contact-chat-message"
import { Icons } from "@/components/shared/icons"

type ChatThreadProps = {
  messages: UIMessage[]
  isLoading: boolean
  hasError: boolean
}

export const ChatThread = forwardRef<HTMLElement, ChatThreadProps>(
  function ChatThread({ messages, isLoading, hasError }, ref) {
    if (messages.length === 0 && !hasError) return null

    return (
      <section
        ref={ref}
        aria-labelledby="interview-thread"
        className="space-y-4 border-t pt-5"
      >
        <h3 id="interview-thread" className="text-sm font-semibold">
          Your questions
        </h3>
        <div className="space-y-5">
          {messages.map((message) => (
            <div key={message.id}>
              <ContactChatMessage message={message} />
            </div>
          ))}
        </div>
        {isLoading && (
          <p
            aria-hidden
            className="text-muted-foreground flex items-center gap-2 text-xs"
          >
            <Icons.spinner className="size-3.5 animate-spin" />
            Thinking...
          </p>
        )}
        {hasError && (
          <p role="alert" className="text-sm">
            The chat is not answering right now. The cards still work, or email{" "}
            <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        )}
      </section>
    )
  }
)
