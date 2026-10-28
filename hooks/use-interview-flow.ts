import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  JOURNEY_CARD_BY_ID,
  PERSONA_BY_ID,
  type JourneyCard,
  type PersonaId,
} from "@/data/journey"

import { JourneyPageContext } from "@/types"

import {
  matchResponseSchema,
  type JourneyMatch,
  type MatchErrorCode,
} from "@/lib/journey/match-schema"
import { matchSummaryText } from "@/lib/journey/summary"

export type MatchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; data: JourneyMatch }
  | { status: "error"; code: MatchErrorCode | "network" }

export type DeckItem =
  | { key: "match" }
  | { key: "closing" }
  | { key: string; card: JourneyCard }

function isCardItem(
  item: DeckItem
): item is { key: string; card: JourneyCard } {
  return "card" in item
}

function rankCards(cards: JourneyCard[], match: MatchState): JourneyCard[] {
  if (match.status !== "done") return cards
  const weights = new Map<string, number>()
  for (const item of match.data.matches) {
    for (const proof of item.proof) {
      weights.set(proof.href, (weights.get(proof.href) ?? 0) + 2)
    }
  }
  for (const item of match.data.partials) {
    for (const proof of item.proof) {
      weights.set(proof.href, (weights.get(proof.href) ?? 0) + 1)
    }
  }
  const score = (card: JourneyCard) =>
    card.proof.reduce((sum, chip) => sum + (weights.get(chip.href) ?? 0), 0)
  return cards
    .map((card, index) => ({ card, index, score: score(card) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.card)
}

export function useInterviewFlow(
  setContext: (context: JourneyPageContext | null) => void
) {
  const [personaId, setPersonaId] = useState<PersonaId | null>(null)
  const [currentKey, setCurrentKey] = useState<string>("")
  const [revealed, setRevealed] = useState<string[]>([])
  const [match, setMatch] = useState<MatchState>({ status: "idle" })
  const jobInput = useRef("")
  const controller = useRef<AbortController | null>(null)

  const deck = useMemo<DeckItem[]>(() => {
    const persona = personaId ? PERSONA_BY_ID.get(personaId) : undefined
    if (!persona) return []
    const cards = persona.cardIds.flatMap((id) => {
      const card = JOURNEY_CARD_BY_ID.get(id)
      return card ? [card] : []
    })
    return [
      ...(match.status === "idle" ? [] : [{ key: "match" } as const]),
      ...rankCards(cards, match).map((card) => ({ key: card.id, card })),
      { key: "closing" } as const,
    ]
  }, [personaId, match])

  const found = deck.findIndex((item) => item.key === currentKey)
  const position = found === -1 ? 0 : found
  const current = deck[position]

  const runMatch = useCallback(async () => {
    controller.current?.abort()
    const abort = new AbortController()
    controller.current = abort
    setMatch({ status: "loading" })
    try {
      const res = await fetch("/api/journey/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: jobInput.current }),
        signal: abort.signal,
      })
      const parsed = matchResponseSchema.safeParse(
        await res.json().catch(() => null)
      )
      if (parsed.success && "match" in parsed.data) {
        setMatch({ status: "done", data: parsed.data.match })
      } else {
        setMatch({
          status: "error",
          code:
            parsed.success && "error" in parsed.data
              ? parsed.data.error
              : "model-unavailable",
        })
      }
    } catch {
      if (abort.signal.aborted) return
      setMatch({ status: "error", code: "network" })
    }
  }, [])

  const choosePersona = useCallback(
    (id: PersonaId, job: string) => {
      const persona = PERSONA_BY_ID.get(id)
      if (!persona) return
      setPersonaId(id)
      setCurrentKey(persona.cardIds[0] ?? "closing")
      setRevealed([])
      setMatch({ status: "idle" })
      jobInput.current = job.trim()
      if (jobInput.current) void runMatch()
    },
    [runMatch]
  )

  const go = useCallback(
    (delta: number) => {
      const target =
        deck[Math.min(deck.length - 1, Math.max(0, position + delta))]
      if (target) setCurrentKey(target.key)
    },
    [deck, position]
  )

  const goTo = useCallback((key: string) => setCurrentKey(key), [])

  const reveal = useCallback((id: string) => {
    setRevealed((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const restart = useCallback(() => {
    controller.current?.abort()
    setPersonaId(null)
    setCurrentKey("")
    setRevealed([])
    setMatch({ status: "idle" })
    jobInput.current = ""
  }, [])

  useEffect(() => () => controller.current?.abort(), [])

  const currentCardId = current && isCardItem(current) ? current.card.id : null
  const matchSummary =
    match.status === "done" ? matchSummaryText(match.data) : undefined

  useEffect(() => {
    setContext(
      personaId
        ? { persona: personaId, cardId: currentCardId, matchSummary }
        : null
    )
  }, [personaId, currentCardId, matchSummary, setContext])

  return {
    personaId,
    deck,
    position,
    current,
    revealed,
    match,
    choosePersona,
    go,
    goTo,
    reveal,
    restart,
    retryMatch: runMatch,
  }
}

export { isCardItem }
