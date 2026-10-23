"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { INTRODUCTION_SCRIPT, type JourneyScript } from "@/data/journey-scripts"
import { useChatDock } from "@/providers/chat-provider"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react"

import {
  playJourneyClose,
  playJourneyExpand,
  playJourneyStep,
  playJourneyTick,
} from "@/lib/journey-sound"
import { cn } from "@/lib/utils"
import type { IntroductionJourneyApi } from "@/hooks/use-introduction-journey"

import { PronounceNameButton } from "@/components/app/pronounce-name-button"
import { TypewriterText } from "@/components/app/typewriter-text"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const INTERACTIVE_TARGET_SELECTOR =
  "button, a, input, textarea, select, [role='button'], [contenteditable='true']"

const FOCUSABLE_SELECTOR =
  "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])"

const SWIPE_DISTANCE_PX = 56
const SWIPE_VELOCITY_PX = 420
const AUTO_ADVANCE_DELAY_MS = 3800

function padStep(position: number) {
  return String(position).padStart(2, "0")
}

function JourneyScrubber({
  steps,
  activeIndex,
  isTypingComplete,
  onSelect,
}: {
  steps: JourneyScript[]
  activeIndex: number
  isTypingComplete: boolean
  onSelect: (index: number) => void
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <nav
      aria-label="Introduction chapters"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      className="relative grid gap-1.5 px-4 pt-3 sm:gap-2 sm:px-8 sm:pt-5"
    >
      {steps.map((item, idx) => {
        const isPast = idx < activeIndex
        const isCurrent = idx === activeIndex

        return (
          <div key={item.id} className="relative">
            <button
              type="button"
              onClick={() => onSelect(idx)}
              onPointerEnter={() => setHoveredIndex(idx)}
              onPointerLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex(null)}
              aria-label={`Chapter ${idx + 1}: ${item.title}`}
              aria-current={isCurrent ? "step" : undefined}
              className="focus-visible:ring-ring group block w-full cursor-pointer rounded-sm py-2 outline-none focus-visible:ring-2"
            >
              <div className="bg-foreground/15 group-hover:bg-foreground/30 relative h-1 w-full overflow-hidden rounded-full transition-colors">
                <div
                  className={cn(
                    "bg-primary h-full rounded-full transition-all duration-500 ease-out",
                    isPast && "w-full",
                    isCurrent && (isTypingComplete ? "w-full" : "w-2/3"),
                    !isPast && !isCurrent && "w-0"
                  )}
                />
              </div>
            </button>

            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14 }}
                  className="bg-popover text-popover-foreground border-border pointer-events-none absolute left-1/2 top-full z-30 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md border px-2.5 py-1 shadow-lg"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider">
                    {padStep(idx + 1)} · {item.title}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </nav>
  )
}

function JourneyTelemetryCard({
  step,
  stepIndex,
  onCloseForNavigation,
}: {
  step: JourneyScript
  stepIndex: number
  onCloseForNavigation: () => void
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.aside
      key={`telemetry-${step.id}`}
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 16, scale: 0.98 }
      }
      animate={
        prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 28,
        delay: 0.06,
      }}
      aria-label={`${step.title} key facts`}
      className="border-border/80 bg-card/65 relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-2xl backdrop-blur-xl sm:p-6"
    >
      {/* Top telemetry header */}
      <div>
        <div className="border-border/60 flex items-center justify-between border-b pb-3.5">
          <div className="flex items-center gap-2">
            <span className="bg-primary size-2 rounded-full" />
            <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.24em]">
              Key facts · Ch. {padStep(stepIndex + 1)}
            </span>
          </div>
          <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
            {step.period}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {step.metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 10 }
              }
              animate={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
              }
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 28,
                delay: 0.1 + idx * 0.07,
              }}
              className="border-border/50 bg-background/50 rounded-xl border p-3.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-foreground font-mono text-xl font-bold tabular-nums tracking-tight sm:text-2xl">
                  {metric.value}
                </span>
                <span className="text-primary font-mono text-[10px] uppercase tracking-wider">
                  {metric.label}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {metric.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-border/60 mt-5 border-t pt-4">
        <p className="text-muted-foreground mb-2.5 font-mono text-[10px] uppercase tracking-[0.22em]">
          Stack
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {step.stack.map((node) => (
            <span
              key={node}
              className="border-border/80 bg-background/70 text-foreground rounded-md border px-2 py-1 font-mono text-[11px]"
            >
              {node}
            </span>
          ))}
        </div>

        {step.caseStudyHref && (
          <div className="mt-4 flex justify-end">
            <Link
              href={step.caseStudyHref}
              onClick={onCloseForNavigation}
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 font-mono text-xs font-medium underline-offset-4 hover:underline"
            >
              Read the case study
              <Icons.arrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </motion.aside>
  )
}

function JourneyAskBar({
  inputRef,
  onAsk,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  onAsk: (text: string) => void
}) {
  const [value, setValue] = useState("")

  return (
    <form
      className="flex w-full items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!value.trim()) return
        onAsk(value.trim())
        setValue("")
      }}
    >
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          placeholder="Ask the chat a question (press / to focus)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Ask the chat a question"
          className="bg-background/70 border-border/80 h-9 pr-8 text-xs sm:text-sm"
        />
        <kbd
          aria-hidden
          className="text-muted-foreground pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline-block"
        >
          /
        </kbd>
      </div>
      <Button type="submit" size="sm" disabled={!value.trim()} className="h-9">
        <Icons.send className="size-3.5" />
        <span className="ml-1.5 hidden sm:inline">Ask AI</span>
      </Button>
    </form>
  )
}

interface IntroductionJourneyOverlayProps {
  journey: IntroductionJourneyApi
}

export function IntroductionJourneyOverlay({
  journey,
}: IntroductionJourneyOverlayProps) {
  const chat = useChatDock()
  const prefersReducedMotion = useReducedMotion()
  const [skip, setSkip] = useState(false)
  const askInputRef = useRef<HTMLInputElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  const total = INTRODUCTION_SCRIPT.steps.length
  const step = journey.currentStep
  const {
    isTypingComplete,
    isLastStep,
    stepIndex,
    isExpanded,
    isMuted,
    autoAdvance,
    runId,
  } = journey
  const {
    next,
    prev,
    goTo,
    stop,
    expand,
    reset,
    toggleMute,
    toggleAutoAdvance,
  } = journey

  const handleTick = useCallback(
    (charIndex: number) => {
      if (!isMuted) {
        playJourneyTick(charIndex)
      }
    },
    [isMuted]
  )

  const advance = useCallback(() => {
    setSkip(false)
    if (!isMuted) playJourneyStep("next")
    next()
  }, [next, isMuted])

  const goBack = useCallback(() => {
    setSkip(false)
    if (!isMuted) playJourneyStep("prev")
    prev()
  }, [prev, isMuted])

  const selectChapter = useCallback(
    (index: number) => {
      setSkip(false)
      if (!isMuted) playJourneyStep(index >= stepIndex ? "next" : "prev")
      goTo(index)
    },
    [goTo, stepIndex, isMuted]
  )

  const revealDetails = useCallback(() => {
    setSkip(false)
    if (!isMuted) playJourneyExpand()
    expand()
  }, [expand, isMuted])

  const restart = useCallback(() => {
    setSkip(false)
    if (!isMuted) playJourneyStep("prev")
    reset()
  }, [reset, isMuted])

  const finish = useCallback(() => {
    setSkip(false)
    if (!isMuted) playJourneyClose()
    stop()
  }, [stop, isMuted])

  const handleAsk = useCallback(
    (text: string) => {
      stop()
      chat.seedInput(text)
    },
    [stop, chat]
  )

  // Optional hands-free cinema auto-advance once typing completes.
  useEffect(() => {
    if (!autoAdvance || !isTypingComplete || isLastStep) return
    const timer = setTimeout(() => {
      advance()
    }, AUTO_ADVANCE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [autoAdvance, isTypingComplete, isLastStep, advance])

  // Lock page scroll while the overlay owns the screen.
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  // Move focus into the dialog on open and restore it to the trigger on close,
  // unless something else (the chat input) took focus in the meantime.
  useEffect(() => {
    const dialog = dialogRef.current
    const previouslyFocused = document.activeElement
    dialog?.focus()

    return () => {
      const active = document.activeElement
      const focusIsFree =
        !active || active === document.body || dialog?.contains(active)
      if (focusIsFree && previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [])

  // Keyboard choreography: Space, Arrows, D (more detail), M (mute), A (auto), 1-9, /, Esc.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target

      if (e.key === "Tab") {
        const dialog = dialogRef.current
        if (!dialog) return
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) {
          e.preventDefault()
          return
        }
        const active = document.activeElement
        if (!active || !dialog.contains(active) || active === dialog) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
        return
      }

      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, [contenteditable='true']")
      ) {
        if (e.key === "Escape") target.blur()
        return
      }

      if (e.key === "Escape") {
        e.preventDefault()
        finish()
        return
      }

      // Never hijack browser/OS shortcuts like Cmd+R, Cmd+1, or Ctrl+M.
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === "/") {
        e.preventDefault()
        askInputRef.current?.focus()
        return
      }

      if (e.key === "m" || e.key === "M") {
        e.preventDefault()
        toggleMute()
        return
      }

      if (e.key === "a" || e.key === "A") {
        e.preventDefault()
        toggleAutoAdvance()
        return
      }

      if ((e.key === "d" || e.key === "D") && isTypingComplete && !isExpanded) {
        e.preventDefault()
        revealDetails()
        return
      }

      if (e.key >= "1" && e.key <= "9") {
        const idx = Number(e.key) - 1
        if (idx < total) {
          e.preventDefault()
          selectChapter(idx)
        }
        return
      }

      if (e.key === "ArrowRight") {
        e.preventDefault()
        if (!isTypingComplete) {
          setSkip(true)
        } else if (!isLastStep) {
          advance()
        }
        return
      }

      if (e.key === "ArrowLeft") {
        if (stepIndex > 0) {
          e.preventDefault()
          goBack()
        }
        return
      }

      if (e.code === "Space") {
        if (
          target instanceof HTMLElement &&
          target.closest(INTERACTIVE_TARGET_SELECTOR)
        ) {
          return
        }
        e.preventDefault()
        if (!isTypingComplete) {
          setSkip(true)
        } else if (!isLastStep) {
          advance()
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [
    advance,
    goBack,
    finish,
    revealDetails,
    selectChapter,
    toggleMute,
    toggleAutoAdvance,
    isTypingComplete,
    isExpanded,
    isLastStep,
    stepIndex,
    total,
  ])

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info
    if (offset.x < -SWIPE_DISTANCE_PX || velocity.x < -SWIPE_VELOCITY_PX) {
      if (!isTypingComplete) {
        setSkip(true)
      } else if (!isLastStep) {
        advance()
      }
    } else if (
      (offset.x > SWIPE_DISTANCE_PX || velocity.x > SWIPE_VELOCITY_PX) &&
      stepIndex > 0
    ) {
      goBack()
    }
  }

  return (
    <motion.div
      ref={dialogRef}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[100] select-none outline-none"
      role="dialog"
      aria-modal="true"
      aria-label="Introduction"
    >
      {/* Backdrop canvas with dynamic chapter spotlight & architectural dot matrix */}
      <div
        onClick={() => {
          if (!isTypingComplete) setSkip(true)
        }}
        className="bg-background/95 absolute inset-0 h-full w-full backdrop-blur-3xl"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(65% 55% at 50% 38%, ${step.accent}, transparent 75%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(var(--foreground) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse at center, black 35%, transparent 80%)",
          }}
        />
      </div>

      <p aria-live="polite" className="sr-only">
        Chapter {stepIndex + 1} of {total}: {step.title}
      </p>

      <div className="relative mx-auto flex h-dvh max-w-6xl flex-col justify-between">
        {/* Top Story Scrubber + Studio Bar */}
        <div>
          <JourneyScrubber
            steps={INTRODUCTION_SCRIPT.steps}
            activeIndex={stepIndex}
            isTypingComplete={isTypingComplete}
            onSelect={selectChapter}
          />

          <header className="flex items-center justify-between px-4 pt-3 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center gap-2.5">
                <Image
                  src="/about/author.png"
                  alt="Malek Gara-Hellal"
                  width={28}
                  height={28}
                  className="ring-border size-7 rounded-full object-cover ring-1"
                />
                <div className="flex flex-col">
                  <span className="text-foreground flex items-center gap-1.5 text-xs font-medium">
                    Introduction
                    {!isTypingComplete && (
                      <span
                        aria-hidden
                        className="inline-flex h-2.5 items-end gap-0.5"
                      >
                        <span className="bg-primary h-1.5 w-0.5 animate-pulse rounded-full" />
                        <span className="bg-primary h-2.5 w-0.5 animate-pulse rounded-full" />
                        <span className="bg-primary h-1 w-0.5 animate-pulse rounded-full" />
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                    Chapter {padStep(stepIndex + 1)} of {padStep(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={toggleAutoAdvance}
                aria-pressed={autoAdvance}
                title="Toggle hands-free auto-advance (A)"
                className={cn(
                  "border-border/70 flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 font-mono text-[10px] uppercase tracking-wider transition-colors",
                  autoAdvance
                    ? "bg-primary/15 text-primary border-primary/40"
                    : "bg-background/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    autoAdvance
                      ? "bg-primary animate-ping motion-reduce:animate-none"
                      : "bg-muted-foreground/50"
                  )}
                />
                <span className="hidden sm:inline">Auto</span>
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-pressed={!isMuted}
                title={isMuted ? "Unmute sound (M)" : "Mute sound (M)"}
                className="border-border/70 bg-background/50 text-muted-foreground hover:text-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 font-mono text-[10px] uppercase tracking-wider transition-colors"
              >
                <Icons.volume className="size-3.5" />
                <span className="hidden sm:inline">
                  {isMuted ? "Muted" : "SFX On"}
                </span>
              </button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={finish}
                aria-label="Exit introduction (Esc)"
                className="text-muted-foreground hover:text-foreground size-8 rounded-full"
              >
                <Icons.close className="size-4" />
              </Button>
            </div>
          </header>
        </div>

        {/* Center Interactive Stage (Swipeable on mobile/touch) */}
        <motion.div
          drag={prefersReducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragEnd={handleDragEnd}
          className="flex flex-1 items-center overflow-y-auto px-4 py-4 sm:px-8 sm:py-6"
        >
          <div
            key={`${runId}-${step.id}`}
            className="grid w-full items-center gap-6 lg:grid-cols-12 lg:gap-10"
          >
            {/* Left 7 Cols: Story & Narration */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }
              }
              animate={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="flex flex-col justify-center lg:col-span-7"
            >
              {/* Chapter Identity Pill */}
              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <div className="border-border/80 bg-card/80 flex items-center gap-2.5 rounded-full border py-1 pl-1.5 pr-3.5 shadow-sm">
                  <Image
                    src={step.logo}
                    alt={step.title}
                    width={24}
                    height={24}
                    className="bg-background size-6 rounded-full object-contain p-0.5"
                  />
                  <span className="text-foreground text-xs font-semibold">
                    {step.title}
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    · {step.role}
                  </span>
                </div>

                <span className="text-muted-foreground font-mono text-[11px]">
                  {step.location}
                </span>

                {step.id === "hello" && (
                  <PronounceNameButton
                    name="Malek"
                    className="border-border/70 bg-background/60 size-7 rounded-full border"
                  />
                )}
              </div>

              {/* Main Typewriter Narration */}
              <h2
                onClick={() => {
                  if (!isTypingComplete) setSkip(true)
                }}
                className="text-foreground cursor-pointer text-balance text-2xl font-semibold leading-[1.22] tracking-tight sm:text-3xl lg:text-[2.25rem]"
              >
                <TypewriterText
                  key={`summary-${runId}-${step.id}`}
                  text={step.summary}
                  skip={skip}
                  onComplete={journey.completeTyping}
                  onTick={handleTick}
                />
              </h2>

              {/* Expandable Engineering Deep Dive */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <div className="border-primary/40 bg-primary/5 mt-5 rounded-xl border-l-2 p-4">
                      <p className="text-primary mb-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                        Details
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                        <TypewriterText
                          key={`details-${runId}-${step.id}`}
                          text={step.details}
                          speed={10}
                          skip={skip}
                          onTick={handleTick}
                        />
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contextual One-Click AI Prompts */}
              <div className="mt-6">
                <p className="text-muted-foreground mb-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                  Ask the chat about {step.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleAsk(prompt)}
                      className="border-border/80 bg-card/60 hover:bg-accent hover:border-primary/40 text-foreground group flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-xs transition-all"
                    >
                      <span className="text-primary font-mono text-[10px]">
                        ✦
                      </span>
                      <span>{prompt}</span>
                      <Icons.arrowRight className="text-muted-foreground group-hover:text-foreground size-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right 5 Cols: Living Telemetry & Proof Card */}
            <div className="lg:col-span-5">
              <JourneyTelemetryCard
                step={step}
                stepIndex={stepIndex}
                onCloseForNavigation={finish}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom Studio Controls & AI Command Bar */}
        <footer className="border-border/60 bg-background/60 space-y-3 border-t px-4 py-3.5 backdrop-blur-md sm:px-8 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {stepIndex > 0 && (
                <Button variant="outline" size="sm" onClick={goBack}>
                  <Icons.arrowLeft className="mr-1.5 size-3.5" />
                  Back
                </Button>
              )}

              {!isTypingComplete && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSkip(true)}
                >
                  Fast-forward
                  <kbd className="bg-primary-foreground/20 ml-2 hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
                    Space
                  </kbd>
                </Button>
              )}

              {isTypingComplete && !isExpanded && (
                <Button variant="outline" size="sm" onClick={revealDetails}>
                  <Icons.add className="mr-1.5 size-3.5" />
                  More detail
                  <kbd className="bg-muted ml-2 hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
                    D
                  </kbd>
                </Button>
              )}

              {isTypingComplete && !isLastStep && (
                <Button size="sm" onClick={advance}>
                  Next chapter
                  <Icons.arrowRight className="ml-1.5 size-3.5" />
                  <kbd className="bg-primary-foreground/20 ml-2 hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
                    Space
                  </kbd>
                </Button>
              )}

              {isTypingComplete && isLastStep && (
                <Button size="sm" onClick={finish}>
                  Close
                  <Icons.check className="ml-1.5 size-3.5" />
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={restart}>
                <Icons.refresh className="mr-1.5 size-3.5" />
                Restart
              </Button>
            </div>

            <div className="w-full sm:max-w-sm">
              <JourneyAskBar inputRef={askInputRef} onAsk={handleAsk} />
            </div>
          </div>

          <div className="text-muted-foreground flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="sm:hidden">
              Swipe left/right · Tap text to fast-forward
            </span>
            <span className="hidden sm:inline">
              Space fast-forward / next · 1–9 jump chapters · D more detail · M
              sound · A auto-play · Esc exit
            </span>
            <span className="tabular-nums">
              {Math.round(journey.progress)}%
            </span>
          </div>
        </footer>
      </div>
    </motion.div>
  )
}
