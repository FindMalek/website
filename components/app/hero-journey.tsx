"use client"

import { useIntroductionJourney } from "@/hooks/use-introduction-journey"

import { INTRODUCTION_SCRIPT } from "@/data/journey-scripts"

import { IntroductionJourney } from "@/components/app/introduction-journey"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

interface HeroJourneyProps {
  hero: React.ReactNode
}

export function HeroJourney({ hero }: HeroJourneyProps) {
  const journey = useIntroductionJourney(INTRODUCTION_SCRIPT.steps)

  if (journey.isActive) {
    return <IntroductionJourney journey={journey} />
  }

  return (
    <div className="relative">
      {hero}
      <div className="px-4 pb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={journey.start}
          className="w-full sm:w-auto"
        >
          <Icons.moveRight className="mr-1.5 size-4" />
          Start the introduction
        </Button>
      </div>
    </div>
  )
}
