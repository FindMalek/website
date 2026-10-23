"use client"

import { createContext, useContext, useMemo } from "react"
import { INTRODUCTION_SCRIPT } from "@/data/journey-scripts"
import { AnimatePresence } from "motion/react"

import { useIntroductionJourney } from "@/hooks/use-introduction-journey"

import { IntroductionJourneyOverlay } from "@/components/app/introduction-journey"

interface IntroductionJourneyContextValue {
  start: () => void
}

const IntroductionJourneyContext =
  createContext<IntroductionJourneyContextValue | null>(null)

export function useIntroductionJourneyStart() {
  const context = useContext(IntroductionJourneyContext)
  if (!context) {
    throw new Error(
      "useIntroductionJourneyStart must be used within IntroductionJourneyProvider"
    )
  }
  return context
}

export function IntroductionJourneyProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const journey = useIntroductionJourney(INTRODUCTION_SCRIPT.steps)
  const { start } = journey
  const value = useMemo(() => ({ start }), [start])

  return (
    <IntroductionJourneyContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {journey.isActive && <IntroductionJourneyOverlay journey={journey} />}
      </AnimatePresence>
    </IntroductionJourneyContext.Provider>
  )
}
