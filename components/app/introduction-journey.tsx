"use client"

import { useEffect, useRef, useState } from "react"

import { useChatDock } from "@/providers/chat-provider"

import { INTRODUCTION_SCRIPT } from "@/data/journey-scripts"
import { useIntroductionJourney } from "@/hooks/use-introduction-journey"

import { TypewriterText } from "@/components/app/typewriter-text"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/shared/icons"

function JourneyProgress({ progress }: { progress: number }) {
  return (
    <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
      <div
        className="bg-primary h-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function JourneyControls({
  isTypingComplete,
  isExpanded,
  isLastStep,
  onSkip,
  onDetails,
  onNext,
  onReset,
  onStop,
}: {
  isTypingComplete: boolean
  isExpanded: boolean
  isLastStep: boolean
  onSkip: () => void
  onDetails: () => void
  onNext: () => void
  onReset: () => void
  onStop: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isTypingComplete && (
        <Button variant="outline" size="sm" onClick={onSkip}>
          <Icons.arrowRight className="mr-1.5 size-4" />
          Skip
        </Button>
      )}

      {isTypingComplete && !isExpanded && !isLastStep && (
        <Button variant="outline" size="sm" onClick={onDetails}>
          <Icons.add className="mr-1.5 size-4" />
          Listen with details
        </Button>
      )}

      {isTypingComplete && !isLastStep && (
        <Button size="sm" onClick={onNext}>
          Next
          <Icons.arrowRight className="ml-1.5 size-4" />
        </Button>
      )}

      {isTypingComplete && isLastStep && (
        <Button size="sm" onClick={onStop}>
          Finish
          <Icons.check className="ml-1.5 size-4" />
        </Button>
      )}

      <Button variant="ghost" size="sm" onClick={onReset}>
        <Icons.refresh className="mr-1.5 size-4" />
        Restart
      </Button>
    </div>
  )
}

function JourneyInput({ onAsk }: { onAsk: (text: string) => void }) {
  const [value, setValue] = useState("")

  return (
    <form
      className="flex items-center gap-2"
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
        className="flex-1"
      />
      <Button type="submit" size="sm" disabled={!value.trim()}>
        <Icons.send className="size-4" />
        <span className="sr-only">Ask</span>
      </Button>
    </form>
  )
}

interface IntroductionJourneyProps {
  journey: ReturnType<typeof useIntroductionJourney>
}

export function IntroductionJourney({ journey }: IntroductionJourneyProps) {
  const chat = useChatDock()
  const containerRef = useRef<HTMLDivElement>(null)
  const [skip, setSkip] = useState(false)

  // Reset the transient skip flag whenever the step changes.
  useEffect(() => {
    let cancelled = false
    const id = setTimeout(() => {
      if (!cancelled) setSkip(false)
    }, 0)
    return () => {
      cancelled = true
      clearTimeout(id)
    }
  }, [journey.stepIndex, journey.isExpanded])

  // Space bar fast-forwards the current animation, but only while typing is
  // incomplete and not when interacting with buttons, links, inputs, etc.
  useEffect(() => {
    if (journey.isTypingComplete) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return

      const target = e.target as HTMLElement | null
      if (!target) return

      const isInteractiveTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable ||
        target.closest("button, a, [role='button']")

      if (isInteractiveTarget) return

      e.preventDefault()
      setSkip(true)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [journey.isTypingComplete])

  const handleAsk = (text: string) => {
    // Pause the journey visually while the chat opens.
    chat.seedInput(text)
  }

  const currentText = journey.isExpanded
    ? journey.currentStep.details
    : journey.currentStep.summary

  return (
    <div
      ref={containerRef}
      className="screen-line-bottom px-4 pb-6 pt-12"
      onClick={() => {
        // Mobile tap-to-skip: tapping the text card completes the animation.
        if (!journey.isTypingComplete) {
          setSkip(true)
        }
      }}
      role="region"
      aria-label="Introduction journey"
    >
      <JourneyProgress progress={journey.progress} />

      <div className="mt-6">
        <p className="text-muted-foreground mb-2 text-sm">
          Step {journey.stepIndex + 1} of {INTRODUCTION_SCRIPT.steps.length}
        </p>
        <h2 className="text-balance text-2xl font-bold tracking-tight">
          {journey.stepIndex === 0 ? "Hello, I'm Malek" : journey.currentStep.title}
        </h2>

        {journey.stepIndex === 0 && (
          <p className="text-muted-foreground mt-2 text-base">
            {INTRODUCTION_SCRIPT.opening}
          </p>
        )}

        <div className="text-foreground mt-4 min-h-[4rem] text-base leading-relaxed">
          <TypewriterText
            key={`${journey.stepIndex}-${journey.isExpanded}`}
            text={currentText}
            skip={skip}
            onComplete={journey.completeTyping}
          />
        </div>

        <div className="mt-6 space-y-4">
          <JourneyControls
            isTypingComplete={journey.isTypingComplete}
            isExpanded={journey.isExpanded}
            isLastStep={journey.isLastStep}
            onSkip={() => setSkip(true)}
            onDetails={journey.expand}
            onNext={journey.next}
            onReset={journey.reset}
            onStop={journey.stop}
          />

          <div className="border-line border-t pt-4">
            <JourneyInput onAsk={handleAsk} />
            <p className="text-muted-foreground mt-2 text-xs">
              Press space to fast-forward, or ask me anything at any step.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
