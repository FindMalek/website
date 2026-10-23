"use client"

import { useCallback, useState } from "react"
import type { JourneyScript } from "@/data/journey-scripts"

type JourneyState = {
  isActive: boolean
  stepIndex: number
  isExpanded: boolean
  isTypingComplete: boolean
  isMuted: boolean
  autoAdvance: boolean
  runId: number
}

const DEFAULT_STATE: JourneyState = {
  isActive: false,
  stepIndex: 0,
  isExpanded: false,
  isTypingComplete: false,
  isMuted: true,
  autoAdvance: false,
  runId: 0,
}

export function useIntroductionJourney(steps: JourneyScript[]) {
  const [state, setState] = useState<JourneyState>(DEFAULT_STATE)

  const start = useCallback(() => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      isMuted: prev.isMuted,
      isActive: true,
    }))
  }, [])

  const reset = useCallback(() => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      isMuted: prev.isMuted,
      autoAdvance: prev.autoAdvance,
      isActive: true,
      runId: prev.runId + 1,
    }))
  }, [])

  const stop = useCallback(() => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      isMuted: prev.isMuted,
      isActive: false,
    }))
  }, [])

  const next = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.stepIndex + 1
      if (nextIndex >= steps.length) {
        return {
          ...DEFAULT_STATE,
          isMuted: prev.isMuted,
          isActive: false,
        }
      }
      return {
        ...prev,
        stepIndex: nextIndex,
        isExpanded: false,
        isTypingComplete: false,
      }
    })
  }, [steps.length])

  const prevStep = useCallback(() => {
    setState((prev) =>
      prev.stepIndex > 0
        ? {
            ...prev,
            stepIndex: prev.stepIndex - 1,
            isExpanded: false,
            isTypingComplete: false,
          }
        : prev
    )
  }, [])

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return
      setState((prev) =>
        index === prev.stepIndex
          ? prev
          : {
              ...prev,
              stepIndex: index,
              isExpanded: false,
              isTypingComplete: false,
            }
      )
    },
    [steps.length]
  )

  const expand = useCallback(() => {
    setState((prev) => ({ ...prev, isExpanded: true, isTypingComplete: true }))
  }, [])

  const completeTyping = useCallback(() => {
    setState((prev) => ({ ...prev, isTypingComplete: true }))
  }, [])

  const toggleMute = useCallback(() => {
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }))
  }, [])

  const toggleAutoAdvance = useCallback(() => {
    setState((prev) => ({ ...prev, autoAdvance: !prev.autoAdvance }))
  }, [])

  const currentStep = steps[state.stepIndex] ?? steps[0]
  const isLastStep = state.stepIndex === steps.length - 1
  const progress =
    steps.length > 0 ? ((state.stepIndex + 1) / steps.length) * 100 : 0

  return {
    ...state,
    currentStep,
    isLastStep,
    progress,
    start,
    reset,
    stop,
    next,
    prev: prevStep,
    goTo,
    expand,
    completeTyping,
    toggleMute,
    toggleAutoAdvance,
  }
}

export type { JourneyScript as JourneyStep }

export type IntroductionJourneyApi = ReturnType<typeof useIntroductionJourney>
