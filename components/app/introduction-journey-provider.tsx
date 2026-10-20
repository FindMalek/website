"use client"

import { createContext, useContext } from "react"

import { INTRODUCTION_SCRIPT } from "@/data/journey-scripts"
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

  return (
    <IntroductionJourneyContext.Provider value={{ start: journey.start }}>
      {children}
      {journey.isActive && <IntroductionJourneyOverlay journey={journey} />}
    </IntroductionJourneyContext.Provider>
  )
}
