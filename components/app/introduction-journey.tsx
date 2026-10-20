"use client"

import { useCallback, useEffect, useState } from "react"

import { useChatDock } from "@/providers/chat-provider"

import { INTRODUCTION_SCRIPT } from "@/data/journey-scripts"
import type { IntroductionJourneyApi } from "@/hooks/use-introduction-journey"

import { TypewriterText } from "@/components/app/typewriter-text"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/shared/icons"

const INTERACTIVE_TARGET_SELECTOR =
  "button, a, input, textarea, select, [role='button'], [contenteditable='true']"

function padStep(position: number) {
  return String(position).padStart(2, "0")
}

function JourneyAskInput({ onAsk }: { onAsk: (text: string) => void }) {
  const [value, setValue] = useState("")

  return (
    <form
      className="mx-auto flex w-full max-w-md items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!value.trim()) return
        onAsk(value.trim())
        setValue("")
      }}
    >
      <Input
        placeholder="Ask me anything..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Ask me anything"
        className="bg-background/60 flex-1"
      />
      <Button type="submit" size="sm" disabled={!value.trim()}>
        <Icons.send className="size-4" />
        <span className="sr-only">Ask</span>
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
  const [skip, setSkip] = useState(false)

  const total = INTRODUCTION_SCRIPT.steps.length
  const step = journey.currentStep
  const { isTypingComplete, isLastStep, stepIndex } = journey
  const { next, prev, stop, expand, reset } = journey

  const advance = useCallback(() => {
    setSkip(false)
    next()
  }, [next])

  const goBack = useCallback(() => {
    setSkip(false)
    prev()
  }, [prev])

  const revealDetails = useCallback(() => {
    setSkip(false)
    expand()
  }, [expand])

  const restart = useCallback(() => {
    setSkip(false)
    reset()
  }, [reset])

  const finish = useCallback(() => {
    setSkip(false)
    stop()
  }, [stop])

  const handleAsk = (text: string) => {
    stop()
    chat.seedInput(text)
  }

  // Lock page scroll while the overlay owns the screen.
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  // Keyboard: esc exits, space fast-forwards or advances, arrows navigate.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, [contenteditable='true']")
      ) {
        if (e.key === "Escape") finish()
        return
      }

      if (e.key === "Escape") {
        e.preventDefault()
        finish()
        return
      }

      if (e.key === "ArrowRight") {
        if (isTypingComplete && !isLastStep) {
          e.preventDefault()
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
  }, [advance, goBack, finish, isTypingComplete, isLastStep, stepIndex])

  // Tap on the dimmed background: skip the typing, then advance.
  const handleBackdropTap = () => {
    if (!journey.isTypingComplete) {
      setSkip(true)
    } else if (!journey.isLastStep) {
      advance()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Introduction journey"
    >
      {/* Scrim: dims and blurs the site behind */}
      <button
        type="button"
        aria-label="Skip typing"
        onClick={handleBackdropTap}
        className="bg-background/85 absolute inset-0 h-full w-full cursor-default backdrop-blur-2xl motion-reduce:backdrop-blur-none"
      />

      <div className="relative flex h-dvh flex-col">
        {/* Chrome: counter, progress, exit */}
        <header className="flex items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.35em] sm:text-xs">
            Introduction
          </p>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground font-mono text-[10px] tabular-nums sm:text-xs">
              {padStep(journey.stepIndex + 1)} / {padStep(total)}
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={finish}
              aria-label="Exit introduction (Esc)"
              className="text-muted-foreground hover:text-foreground size-8"
            >
              <Icons.close className="size-4" />
            </Button>
          </div>
        </header>

        <div className="bg-border mx-4 h-px overflow-hidden sm:mx-8">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{ width: `${journey.progress}%` }}
          />
        </div>

        {/* Stage: one chapter at a time, centered */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10">
          <div
            key={journey.stepIndex}
            className="animate-in fade-in slide-in-from-bottom-6 mx-auto w-full max-w-3xl text-center motion-reduce:animate-none"
          >
            <p className="text-muted-foreground mb-6 font-mono text-xs uppercase tracking-[0.35em]">
              {padStep(journey.stepIndex + 1)} — {step.title}
            </p>

            <h2 className="text-foreground text-balance text-2xl font-semibold leading-snug tracking-tight sm:text-3xl lg:text-4xl">
              <TypewriterText
                key={`summary-${journey.stepIndex}`}
                text={step.summary}
                skip={skip}
                onComplete={journey.completeTyping}
              />
            </h2>

            {journey.isExpanded && (
              <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed sm:text-lg">
                <TypewriterText
                  key={`details-${journey.stepIndex}`}
                  text={step.details}
                  skip={skip}
                />
              </p>
            )}
          </div>
        </div>

        {/* Footer: controls, ask input, keyboard hints */}
        <footer className="border-border/60 space-y-4 border-t px-4 py-4 sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {!journey.isTypingComplete && (
              <Button variant="outline" size="sm" onClick={() => setSkip(true)}>
                Skip
              </Button>
            )}

            {journey.isTypingComplete &&
              !journey.isExpanded &&
              !journey.isLastStep && (
                <Button variant="outline" size="sm" onClick={revealDetails}>
                  <Icons.add className="mr-1.5 size-4" />
                  Details
                </Button>
              )}

            {journey.stepIndex > 0 && (
              <Button variant="ghost" size="sm" onClick={goBack}>
                <Icons.arrowLeft className="mr-1.5 size-4" />
                Back
              </Button>
            )}

            {journey.isTypingComplete && !journey.isLastStep && (
              <Button size="sm" onClick={advance}>
                Next
                <Icons.arrowRight className="ml-1.5 size-4" />
              </Button>
            )}

            {journey.isTypingComplete && journey.isLastStep && (
              <Button size="sm" onClick={finish}>
                Finish
                <Icons.check className="ml-1.5 size-4" />
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={restart}>
              <Icons.refresh className="mr-1.5 size-4" />
              Restart
            </Button>
          </div>

          <JourneyAskInput onAsk={handleAsk} />

          <p className="text-muted-foreground hidden text-center font-mono text-[10px] uppercase tracking-[0.25em] sm:block">
            space — fast-forward · ← → — chapters · esc — exit
          </p>
        </footer>
      </div>
    </div>
  )
}
