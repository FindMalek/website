"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "motion/react"

import type { CardData } from "@/types"

import { OVERVIEW_CARDS } from "@/config/consts"

import { AboutOverviewCard } from "@/components/app/about-overview-card-stack"

const AUTO_SWIPE_INTERVAL_MS = 6000

export function AboutOverviewCardsStack() {
  const [cards, setCards] = useState<CardData[]>(OVERVIEW_CARDS)
  const [isTopCardFlipped, setIsTopCardFlipped] = useState(false)

  const cycleCard = (id: number) => {
    setCards((prevCards) => {
      const cardToMove = prevCards.find((card) => card.id === id)
      if (!cardToMove) return prevCards

      const newCards = prevCards.filter((card) => card.id !== id)
      return [...newCards, cardToMove]
    })
    setIsTopCardFlipped(false)
  }

  // Auto-swipe, paused while the top card is flipped to show its story
  useEffect(() => {
    if (isTopCardFlipped) return

    const interval = setInterval(() => {
      if (cards.length > 0) {
        cycleCard(cards[0].id)
      }
    }, AUTO_SWIPE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [cards, isTopCardFlipped])

  return (
    <div className="relative aspect-square w-full">
      <AnimatePresence mode="popLayout">
        {cards.slice(0, 3).map((card, index) => (
          <AboutOverviewCard
            key={card.id}
            card={card}
            index={index}
            cycleCard={cycleCard}
            totalCards={Math.min(cards.length, 3)}
            isFlipped={index === 0 && isTopCardFlipped}
            onFlipChange={index === 0 ? setIsTopCardFlipped : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
