"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useChatDock } from "@/providers/chat-provider"
import { AnimatePresence, motion } from "motion/react"

import { emitChatActivity } from "@/lib/chat-activity"
import { cn } from "@/lib/utils"
import { useChatMetrics } from "@/hooks/use-chat-metrics"
import { useContactChat } from "@/hooks/use-contact-chat"

import { ContactChatBotErrorMessage } from "@/components/app/contact-chat-bot-error-message"
import { ContactSuggestedPrompts } from "@/components/app/contact-suggeted-prompts"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { PromptInputSubmit } from "@/components/ui/prompt-input"
import { Textarea } from "@/components/ui/textarea"

// The markdown, code and math renderers behind a message are heavy and only
// needed once a conversation is open, so they load on demand, not on every page.
const ContactChatMessage = dynamic(
  () =>
    import("@/components/app/contact-chat-message").then(
      (m) => m.ContactChatMessage
    ),
  { ssr: false }
)

const AT_BOTTOM_THRESHOLD = 24

export function ChatFloatingContainer() {
  const { dockState, closeChat, openChat } = useChatDock()
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
  const metrics = useChatMetrics(messages, isLoading)

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef(new Map<string, HTMLDivElement>())
  const lastScrolledMessageId = useRef<string | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

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

  const checkIsAtBottom = () => {
    const el = scrollAreaRef.current
    if (!el) return
    setIsAtBottom(
      el.scrollHeight - el.scrollTop - el.clientHeight < AT_BOTTOM_THRESHOLD
    )
  }

  // Re-check whenever content grows (streaming text extends scrollHeight
  // without necessarily firing a scroll event on its own).
  useEffect(() => {
    checkIsAtBottom()
  }, [messages, isLoading, isCancelling])

  const scrollToBottom = () => {
    const el = scrollAreaRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }

  // If there's already a real conversation (more than just the seeded
  // welcome message), focusing the input should reopen it right away --
  // no need to send another message first just to see history you already
  // have.
  const handleInputFocus = () => {
    emitChatActivity({ type: "focus" })
    if (messages.length > 1) openChat()
  }

  return (
    <>
      <AnimatePresence>
        {isDocked && (
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/70"
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
          <div className="bg-background relative mb-2 flex max-h-[60vh] flex-col overflow-hidden rounded-none border font-mono">
            <div className="border-foreground/15 text-muted-foreground flex items-center gap-3 border-b px-3 py-1.5 text-xs">
              <span aria-hidden="true" className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="border-foreground/40 size-2 border" />
                ))}
              </span>
              <span className="truncate">visitor@findmalek: ~/chat</span>
            </div>
            <div
              ref={scrollAreaRef}
              onScroll={checkIsAtBottom}
              className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  ref={(el) => {
                    if (el) messageRefs.current.set(message.id, el)
                    else messageRefs.current.delete(message.id)
                  }}
                >
                  <ContactChatMessage
                    message={message}
                    meta={{ ms: metrics.timings[message.id] }}
                  />
                </div>
              ))}
              {(isLoading || isCancelling) && (
                <div className="font-mono text-sm">
                  <p className="text-muted-foreground text-xs">
                    malek@findmalek:~$ reply
                  </p>
                  <p className="border-foreground/20 text-muted-foreground mt-1 flex items-center gap-2 border-l pl-3">
                    <Icons.spinner className="size-4" />
                    thinking
                    <span className="animate-pulse">_</span>
                    <span className="tabular-nums">{(metrics.liveMs / 1000).toFixed(1)}s</span>
                  </p>
                </div>
              )}
            </div>

            <div className="border-foreground/15 text-muted-foreground flex items-center justify-between border-t px-3 py-1 text-xs tabular-nums">
              <span>
                {isLoading
                  ? `running ${(metrics.liveMs / 1000).toFixed(1)}s`
                  : metrics.lastMs !== null
                    ? `last reply ${(metrics.lastMs / 1000).toFixed(1)}s`
                    : "ready"}
              </span>
              <span>~{metrics.tokens} tokens</span>
            </div>

            {!isAtBottom && (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={scrollToBottom}
                aria-label="Scroll to bottom"
                className="bg-background dark:bg-background dark:hover:bg-muted absolute bottom-3 left-1/2 -translate-x-1/2 rounded-none"
              >
                <Icons.down className="size-4" />
              </Button>
            )}

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
          <div className="bg-muted text-muted-foreground rounded-none border p-3 text-center text-sm">
            Message limit reached for this conversation.
          </div>
        ) : (
          <form
            onSubmit={handleFormSubmit}
            className="pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
          >
            <div className="bg-background focus-within:border-foreground/60 relative rounded-none border font-mono transition-colors">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-3 select-none text-sm"
              >
                <span className="text-chart-1 hidden sm:inline">visitor@findmalek</span>
                <span className="text-muted-foreground">:~$</span>
              </span>
              <Textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={() => emitChatActivity({ type: "blur" })}
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
                placeholder="type a message"
                disabled={isLoading || isCancelling}
                rows={1}
                className="max-h-40 min-h-11 resize-none rounded-none border-0 bg-transparent py-3 pl-14 pr-12 text-sm shadow-none focus-visible:ring-0 sm:pl-48"
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
