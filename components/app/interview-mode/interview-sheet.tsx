"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { JOURNEY_CARD_BY_ID } from "@/data/journey"
import { useChatDock } from "@/providers/chat-provider"
import { useInterviewMode } from "@/providers/interview-provider"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { RotateCcw, X } from "lucide-react"

import { MAX_MESSAGES_ALLOWED, PAGES } from "@/config/consts"
import { buildNotesSummary } from "@/lib/journey/summary"
import { getMessageText } from "@/lib/utils"
import { isCardItem, useInterviewFlow } from "@/hooks/use-interview-flow"
import { usePrefersReducedMotion } from "@/hooks/use-typewriter"

import { Button } from "@/components/ui/button"

import { CardView } from "./card-view"
import { ChatInput } from "./chat-input"
import { ChatThread } from "./chat-thread"
import { ClosingCard } from "./closing-card"
import { MatchView } from "./match-view"
import { PersonaStep } from "./persona-step"

const TEXT_FIELD = /^(INPUT|TEXTAREA|SELECT)$/

function applyInert(content: HTMLElement): () => void {
  const root = content.closest("body > *")
  const changed: HTMLElement[] = []
  for (const child of Array.from(document.body.children)) {
    if (child === root || !(child instanceof HTMLElement) || child.inert) {
      continue
    }
    child.inert = true
    changed.push(child)
  }
  return () => {
    for (const child of changed) child.inert = false
  }
}

export function InterviewSheet() {
  const { isOpen, close, returnFocus, setContext } = useInterviewMode()
  const { chat, sendText } = useChatDock()
  const flow = useInterviewFlow(setContext)
  const reducedMotion = usePrefersReducedMotion()

  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null)
  const liveRegion = useRef<HTMLDivElement>(null)
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const bodyRef = useRef<HTMLDivElement>(null)
  const threadRef = useRef<HTMLElement>(null)
  const announcedReply = useRef<string>("")

  const announce = useCallback((text: string) => {
    clearTimeout(announceTimer.current)
    if (liveRegion.current) liveRegion.current.textContent = ""
    announceTimer.current = setTimeout(() => {
      if (liveRegion.current) liveRegion.current.textContent = text
    }, 60)
  }, [])

  useEffect(() => {
    if (!contentEl) return
    const restore = applyInert(contentEl)
    return restore
  }, [contentEl])

  useEffect(() => {
    if (!contentEl) return
    const viewport = window.visualViewport
    if (!viewport) return
    function sync() {
      if (!viewport) return
      if (window.innerWidth >= 640) {
        contentEl?.style.removeProperty("--sheet-h")
        contentEl?.style.removeProperty("--sheet-top")
        return
      }
      contentEl?.style.setProperty("--sheet-h", `${viewport.height - 12}px`)
      contentEl?.style.setProperty(
        "--sheet-top",
        `${viewport.offsetTop + 12}px`
      )
    }
    sync()
    viewport.addEventListener("resize", sync)
    viewport.addEventListener("scroll", sync)
    return () => {
      viewport.removeEventListener("resize", sync)
      viewport.removeEventListener("scroll", sync)
    }
  }, [contentEl])

  const total = flow.deck.length
  const current = flow.current

  const announceItem = useCallback(
    (key: string, index: number) => {
      const item = flow.deck.find((entry) => entry.key === key)
      if (!item) return
      const title = isCardItem(item)
        ? item.card.question
        : item.key === "match"
          ? "How I match this role"
          : "Take it with you"
      announce(`Card ${index + 1} of ${total}. ${title}`)
    },
    [flow.deck, total, announce]
  )

  const move = (delta: number) => {
    const next = Math.min(total - 1, Math.max(0, flow.position + delta))
    if (next === flow.position) return
    flow.go(delta)
    announceItem(flow.deck[next].key, next)
    bodyRef.current?.scrollTo({ top: 0 })
  }

  const matchStatus = flow.match.status
  const previousMatchStatus = useRef(matchStatus)
  useEffect(() => {
    if (previousMatchStatus.current === matchStatus) return
    previousMatchStatus.current = matchStatus
    if (flow.match.status === "done") {
      announce(`Role match ready. ${flow.match.data.summary}`)
    } else if (flow.match.status === "error") {
      announce("I could not read the role. The questions still work.")
    }
  }, [matchStatus, flow.match, announce])

  const lastMessage = chat.messages[chat.messages.length - 1]
  useEffect(() => {
    if (!isOpen || chat.isLoading || lastMessage?.role !== "assistant") return
    if (announcedReply.current === lastMessage.id) return
    announcedReply.current = lastMessage.id
    if (lastMessage.id !== "welcome-message") {
      announce(getMessageText(lastMessage))
    }
  }, [isOpen, chat.isLoading, lastMessage, announce])

  const sentCount = useRef(chat.messages.length)
  useEffect(() => {
    if (chat.messages.length > sentCount.current && isOpen) {
      threadRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      })
    }
    sentCount.current = chat.messages.length
  }, [chat.messages.length, isOpen, reducedMotion])

  const openedCardIds = flow.revealed.filter((id) => JOURNEY_CARD_BY_ID.has(id))
  const buildSummary = () =>
    buildNotesSummary(
      openedCardIds,
      flow.match.status === "done" ? flow.match.data : null
    )

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!flow.personaId || event.defaultPrevented) return
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target
    if (target instanceof HTMLElement && TEXT_FIELD.test(target.tagName)) return
    if (event.key === "ArrowRight") move(1)
    if (event.key === "ArrowLeft") move(-1)
  }

  const restart = () => {
    flow.restart()
    announce("Back to the start. Who is reading?")
  }

  const chatMessages = chat.messages.slice(1)
  const askMore = () => {
    if (chat.isLoading) return
    sendText("Tell me more about this one")
  }

  const nextLabel = (position: number) =>
    position === total - 2 ? "Take it with you" : "Next card"

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] motion-reduce:animate-none" />
        <DialogPrimitive.Content
          ref={setContentEl}
          onKeyDown={onKeyDown}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            bodyRef.current
              ?.querySelector<HTMLElement>("[data-autofocus]")
              ?.focus()
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            returnFocus()
          }}
          className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:slide-out-to-bottom-8 fixed inset-x-0 top-[var(--sheet-top,0.75rem)] z-50 mx-auto flex h-[var(--sheet-h,calc(100dvh-0.75rem))] w-full flex-col overflow-hidden rounded-t-2xl border shadow-2xl outline-none motion-reduce:animate-none sm:inset-x-4 sm:bottom-4 sm:top-auto sm:h-[min(46rem,92dvh)] sm:max-w-xl sm:rounded-2xl"
        >
          <header className="flex items-start justify-between gap-3 border-b px-4 py-3">
            <div className="min-w-0">
              <DialogPrimitive.Title className="font-heading text-base font-semibold">
                Interview mode
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-muted-foreground text-xs">
                {flow.personaId
                  ? `Card ${flow.position + 1} of ${total}`
                  : "A short guided introduction"}
                <span className="sr-only">
                  . Arrow keys move between cards, Escape closes.
                </span>
              </DialogPrimitive.Description>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {flow.personaId && (
                <Button variant="ghost" size="sm" onClick={restart}>
                  <RotateCcw aria-hidden />
                  {PAGES.HOME.text}
                </Button>
              )}
              <DialogPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close interview mode"
                >
                  <X aria-hidden />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </header>

          <div
            ref={bodyRef}
            className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-4 py-5"
          >
            {!flow.personaId ? (
              <PersonaStep
                onStart={(persona, job) => {
                  flow.choosePersona(persona, job)
                  announce(
                    job.trim() ? "Reading the role in the background." : ""
                  )
                }}
              />
            ) : (
              <>
                {flow.match.status !== "idle" && current?.key !== "match" && (
                  <div className="bg-muted/50 flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm">
                    <span>
                      {flow.match.status === "loading" && "Reading the role..."}
                      {flow.match.status === "done" &&
                        "Your role match is ready."}
                      {flow.match.status === "error" &&
                        "I could not read the role."}
                    </span>
                    {flow.match.status !== "loading" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          flow.goTo("match")
                          announce("How I match this role")
                        }}
                      >
                        Open
                      </Button>
                    )}
                  </div>
                )}

                {current && isCardItem(current) && (
                  <CardView
                    key={current.key}
                    card={current.card}
                    revealed={flow.revealed.includes(current.card.id)}
                    nextLabel={nextLabel(flow.position)}
                    onReveal={() => {
                      flow.reveal(current.card.id)
                      announce(current.card.answer.join(" "))
                    }}
                    onNext={() => move(1)}
                    onAskMore={askMore}
                  />
                )}
                {current?.key === "match" && (
                  <MatchView
                    match={flow.match}
                    onRetry={() => void flow.retryMatch()}
                    onNext={() => move(1)}
                  />
                )}
                {current?.key === "closing" && (
                  <ClosingCard buildSummary={buildSummary} />
                )}

                <nav
                  aria-label="Cards"
                  className="flex items-center justify-between gap-3"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => move(-1)}
                    disabled={flow.position === 0}
                  >
                    Back
                  </Button>
                  <div aria-hidden className="flex flex-1 gap-1">
                    {flow.deck.map((item, index) => (
                      <span
                        key={item.key}
                        className={
                          index <= flow.position
                            ? "bg-primary h-1 flex-1 rounded-full"
                            : "bg-muted h-1 flex-1 rounded-full"
                        }
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => move(1)}
                    disabled={flow.position >= total - 1}
                  >
                    Skip ahead
                  </Button>
                </nav>

                <ChatThread
                  ref={threadRef}
                  messages={chatMessages}
                  isLoading={chat.isLoading}
                  hasError={!!chat.error}
                />
              </>
            )}
          </div>

          {flow.personaId && (
            <footer className="bg-background border-t px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
              <ChatInput
                value={chat.input}
                disabled={chat.isLoading}
                limitReached={chat.messages.length >= MAX_MESSAGES_ALLOWED}
                onChange={chat.handleInputChange}
                onSubmit={() => chat.handleSubmit()}
              />
            </footer>
          )}

          <div
            ref={liveRegion}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
