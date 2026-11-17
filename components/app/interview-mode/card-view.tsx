import { useEffect, useState } from "react"
import type { JourneyCard } from "@/data/journey"
import { MessageCircleQuestion } from "lucide-react"

import { useTypewriter } from "@/hooks/use-typewriter"

import { Button } from "@/components/ui/button"

import { AnswerText } from "./answer-text"
import { ProofChips } from "./proof-chips"

const TEXT_FIELD = /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/

type CardViewProps = {
  card: JourneyCard
  revealed: boolean
  nextLabel: string
  onReveal: () => void
  onNext: () => void
  onAskMore: () => void
}

export function CardView({
  card,
  revealed,
  nextLabel,
  onReveal,
  onNext,
  onAskMore,
}: CardViewProps) {
  const [wasRevealed] = useState(revealed)
  const total = card.answer.reduce((sum, line) => sum + line.length, 0)
  const typing = useTypewriter(total, revealed && !wasRevealed)
  const typingNow = revealed && !typing.done

  useEffect(() => {
    if (!typingNow) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== " ") return
      const target = event.target
      if (target instanceof HTMLElement && TEXT_FIELD.test(target.tagName)) {
        return
      }
      event.preventDefault()
      typing.finish()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [typingNow, typing])

  return (
    <article aria-labelledby={`card-${card.id}`} className="space-y-5">
      <h3
        id={`card-${card.id}`}
        className="font-heading text-xl font-semibold leading-snug sm:text-2xl"
      >
        {card.question}
      </h3>

      {revealed ? (
        <div className="space-y-4">
          <AnswerText
            lines={card.answer}
            count={typing.count}
            done={typing.done}
            onSkip={typing.finish}
          />
          <ProofChips
            chips={card.proof}
            className={typing.done ? undefined : "invisible"}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!revealed ? (
          <>
            <Button
              size="lg"
              className="h-11"
              onClick={onReveal}
              data-autofocus
            >
              Show me
            </Button>
            <Button size="lg" className="h-11" variant="ghost" onClick={onNext}>
              Skip
            </Button>
          </>
        ) : typingNow ? (
          <Button
            size="lg"
            className="h-11"
            onClick={typing.finish}
            data-autofocus
          >
            Show it all
          </Button>
        ) : (
          <>
            <Button size="lg" className="h-11" onClick={onNext} data-autofocus>
              {nextLabel}
            </Button>
            <Button
              size="lg"
              className="h-11"
              variant="outline"
              onClick={onAskMore}
            >
              <MessageCircleQuestion aria-hidden />
              Tell me more
            </Button>
          </>
        )}
      </div>
    </article>
  )
}
