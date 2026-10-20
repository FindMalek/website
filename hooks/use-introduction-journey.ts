"use client"

import { useCallback, useEffect, useState } from "react"

import type { JourneyScript } from "@/data/journey-scripts"

type JourneyState = {
  isActive: boolean
  stepIndex: number
  isExpanded: boolean
  isTypingComplete: boolean
  isMuted: boolean
  autoAdvance: boolean
}

const STORAGE_KEY = "introduction-journey-active"

const DEFAULT_STATE: JourneyState = {
  isActive: false,
  stepIndex: 0,
  isExpanded: false,
  isTypingComplete: false,
  isMuted: false,
  autoAdvance: false,
}

export function useIntroductionJourney(steps: JourneyScript[]) {
  // Start from a stable default to avoid hydration mismatches; restore the
  // validated active flag once the component mounts via a deferred update.
  const [state, setState] = useState<JourneyState>(DEFAULT_STATE)
  const [hasRestored, setHasRestored] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as unknown
          if (
            parsed &&
            typeof parsed === "object" &&
            "isActive" in parsed &&
            parsed.isActive === true
          ) {
            const isMuted =
              "isMuted" in parsed && typeof parsed.isMuted === "boolean"
                ? parsed.isMuted
                : false
            setState({ ...DEFAULT_STATE, isActive: true, isMuted })
          }
        }
      } catch {
        // ignore corrupted storage
      } finally {
        setHasRestored(true)
      }
    }, 0)

    return () => {
      clearTimeout(id)
    }
  }, [])

  useEffect(() => {
    if (!hasRestored) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage quota errors
    }
  }, [state, hasRestored])

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
      setState((prev) => ({
        ...prev,
        stepIndex: index,
        isExpanded: false,
        isTypingComplete: false,
      }))
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
