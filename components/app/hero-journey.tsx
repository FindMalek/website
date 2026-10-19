"use client"

import { useIntroductionJourney } from "@/hooks/use-introduction-journey"

import { INTRODUCTION_SCRIPT } from "@/data/journey-scripts"

import { Hero } from "@/components/app/hero"
import { IntroductionJourney } from "@/components/app/introduction-journey"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

export function HeroJourney() {
  const journey = useIntroductionJourney(INTRODUCTION_SCRIPT.steps)

  if (journey.isActive) {
    return <IntroductionJourney />
  }

  return (
    <div className="relative">
      <Hero />
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
