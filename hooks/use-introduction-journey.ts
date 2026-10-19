"use client"

import { useCallback, useEffect, useState } from "react"

type JourneyStep = {
  id: string
  title: string
  summary: string
  details: string
}

type JourneyState = {
  isActive: boolean
  stepIndex: number
  isExpanded: boolean
  isTypingComplete: boolean
}

const STORAGE_KEY = "introduction-journey-active"

function loadInitialState(): JourneyState {
  if (typeof window === "undefined") {
    return {
      isActive: false,
      stepIndex: 0,
      isExpanded: false,
      isTypingComplete: false,
    }
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as JourneyState
      // Always restart on full page reload, but preserve active flag within session.
      return { ...parsed, stepIndex: 0, isExpanded: false, isTypingComplete: false }
    }
  } catch {
    // ignore
  }

  return {
    isActive: false,
    stepIndex: 0,
    isExpanded: false,
    isTypingComplete: false,
  }
}

export function useIntroductionJourney(steps: JourneyStep[]) {
  const [state, setState] = useState<JourneyState>(loadInitialState)

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const start = useCallback(() => {
    setState({
      isActive: true,
      stepIndex: 0,
      isExpanded: false,
      isTypingComplete: false,
    })
  }, [])

  const reset = useCallback(() => {
    setState({
      isActive: true,
      stepIndex: 0,
      isExpanded: false,
      isTypingComplete: false,
    })
  }, [])

  const stop = useCallback(() => {
    setState({
      isActive: false,
      stepIndex: 0,
      isExpanded: false,
      isTypingComplete: false,
    })
  }, [])

  const next = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.stepIndex + 1
      if (nextIndex >= steps.length) {
        return {
          isActive: false,
          stepIndex: 0,
          isExpanded: false,
          isTypingComplete: false,
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

  const expand = useCallback(() => {
    setState((prev) => ({ ...prev, isExpanded: true, isTypingComplete: true }))
  }, [])

  const completeTyping = useCallback(() => {
    setState((prev) => ({ ...prev, isTypingComplete: true }))
  }, [])

  const currentStep = steps[state.stepIndex]
  const isLastStep = state.stepIndex === steps.length - 1
  const progress = steps.length > 0 ? ((state.stepIndex + 1) / steps.length) * 100 : 0

  return {
    ...state,
    currentStep,
    isLastStep,
    progress,
    start,
    reset,
    stop,
    next,
    expand,
    completeTyping,
  }
}

export type { JourneyStep }
