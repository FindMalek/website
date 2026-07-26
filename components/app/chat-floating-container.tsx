"use client"

import { useEffect, useRef } from "react"
import { useChatDock } from "@/providers/chat-provider"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useContactChat } from "@/hooks/use-contact-chat"

import { ContactChatBotErrorMessage } from "@/components/app/contact-chat-bot-error-message"
import { ContactChatMessage } from "@/components/app/contact-chat-message"
import { ContactSuggestedPrompts } from "@/components/app/contact-suggeted-prompts"
import { Icons } from "@/components/shared/icons"
import { PromptInputSubmit } from "@/components/ui/prompt-input"
import { Textarea } from "@/components/ui/textarea"

export function ChatFloatingContainer() {
  const { dockState, closeChat } = useChatDock()
  const {
    messages,
    hasError,
    errorMessage,
    isLoading,
    isCancelling,
    showSuggestions,
    handleSuggestionClick,
    input,
    handleInputChange,
    inputRef,
    handleFormSubmit,
    isMessageLimitReached,
  } = useContactChat()

  const isDocked = dockState === "docked"

  const containerRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef(new Map<string, HTMLDivElement>())
  const lastScrolledMessageId = useRef<string | null>(null)

  // Click/tap or Escape anywhere outside the chat closes it. A document-level
  // listener checking containment (rather than a full-screen backdrop's own
  // onClick) is what actually covers every "outside" case reliably --
  // padding/gaps inside the floating wrapper, the header's own z-50 stacking
  // context, all of it -- instead of depending on exactly which element the
  // click happened to hit.
  useEffect(() => {
    if (!isDocked) return

    function handlePointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeChat()
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeChat()
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isDocked, closeChat])

  // Scroll to the TOP of the newest message -- the visitor's own message
  // right after sending, then the assistant's reply once it starts -- instead
  // of chasing the tail of the growing text. Keyed off message id (not just
  // length) and guarded so it fires exactly once per new message: `messages`
  // gets a new array/object reference on every streamed token too, but we
  // only want to scroll when a genuinely new message appears, not on every
  // delta.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.id === lastScrolledMessageId.current) {
      return
    }
    lastScrolledMessageId.current = lastMessage.id

    messageRefs.current
      .get(lastMessage.id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [messages])

  return (
    <>
      <AnimatePresence>
        {isDocked && (
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={containerRef}
        layout
        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
        className={cn(
          "fixed inset-x-0 z-50 mx-auto flex w-full flex-col px-4",
          isDocked
            ? "bottom-0 max-w-2xl pb-[calc(env(safe-area-inset-bottom)+1rem)]"
            : "bottom-6 max-w-lg"
        )}
      >
        {isDocked && (
          <div className="bg-background/95 mb-2 flex max-h-[60vh] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur">
            <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  ref={(el) => {
                    if (el) messageRefs.current.set(message.id, el)
                    else messageRefs.current.delete(message.id)
                  }}
                >
                  <ContactChatMessage message={message} />
                </div>
              ))}
              {(isLoading || isCancelling) && (
                <div className="bg-muted/50 flex w-fit max-w-[80%] items-center space-x-2 rounded-lg p-3">
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                  <p className="animate-text-gradient font-base inline-flex bg-gradient-to-r from-[#535353] via-[#c9c9c9] to-[#535353] bg-[200%_auto] bg-clip-text text-center text-xs text-transparent dark:from-[#ACACAC] dark:via-[#363636] dark:to-[#ACACAC]">
                    Thinking...
                  </p>
                </div>
              )}
            </div>

            {showSuggestions && messages.length === 1 && (
              <ContactSuggestedPrompts
                onSuggestionClick={handleSuggestionClick}
              />
            )}
          </div>
        )}

        {hasError && (
          <div className="mb-2 flex justify-center">
            <ContactChatBotErrorMessage message={errorMessage} />
          </div>
        )}

        {isMessageLimitReached ? (
          <div className="bg-muted text-muted-foreground rounded-2xl border p-3 text-center text-sm shadow-lg">
            Message limit reached for this conversation.
          </div>
        ) : (
          <form
            onSubmit={handleFormSubmit}
            className="pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
          >
            <div className="bg-background focus-within:ring-ring/50 relative rounded-2xl border shadow-lg transition-[color,box-shadow] focus-within:ring-[3px]">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault()
                    e.currentTarget.form?.requestSubmit()
                  }
                }}
                placeholder="Ask me anything..."
                disabled={isLoading || isCancelling}
                rows={1}
                className="max-h-40 min-h-11 resize-none rounded-2xl border-0 py-3 pl-4 pr-12 shadow-none focus-visible:ring-0"
              />
              <PromptInputSubmit
                status={isLoading ? "streaming" : undefined}
                disabled={isLoading || !input.trim() || isCancelling}
                className="absolute bottom-2 right-2"
              />
            </div>
          </form>
        )}
      </motion.div>
    </>
  )
}
