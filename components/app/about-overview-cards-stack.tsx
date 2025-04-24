"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "motion/react"

import type { CardData } from "@/types"

import { OVERVIEW_CARDS } from "@/config/consts"

import { AboutOverviewCard } from "@/components/app/about-overview-card-stack"

export function AboutOverviewCardsStack() {
  const [cards, setCards] = useState<CardData[]>(OVERVIEW_CARDS)

  const cycleCard = (id: number) => {
    setCards((prevCards) => {
      const cardToMove = prevCards.find((card) => card.id === id)
      if (!cardToMove) return prevCards

      const newCards = prevCards.filter((card) => card.id !== id)
      return [...newCards, cardToMove]
    })
  }

  // Auto-swipe every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (cards.length > 0) {
        cycleCard(cards[0].id)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [cards])

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
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
