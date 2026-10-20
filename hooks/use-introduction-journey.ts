"use client"

import { useCallback, useEffect, useRef, useState } from "react"

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

const DEFAULT_STATE: JourneyState = {
  isActive: false,
  stepIndex: 0,
  isExpanded: false,
  isTypingComplete: false,
}

export function useIntroductionJourney(steps: JourneyStep[]) {
  // Start from a stable default to avoid hydration mismatches; restore the
  // validated active flag once the component mounts via a deferred update.
  const [state, setState] = useState<JourneyState>(DEFAULT_STATE)
  const didRestoreRef = useRef(false)

  useEffect(() => {
    if (didRestoreRef.current) return
    didRestoreRef.current = true

    let cancelled = false
    const id = setTimeout(() => {
      if (cancelled) return
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const parsed = JSON.parse(raw) as unknown
        if (
          parsed &&
          typeof parsed === "object" &&
          "isActive" in parsed &&
          parsed.isActive === true
        ) {
          setState({ ...DEFAULT_STATE, isActive: true })
        }
      } catch {
        // ignore corrupted storage
      }
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(id)
    }
  }, [])

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
    prev: prevStep,
    expand,
    completeTyping,
  }
}

export type { JourneyStep }

export type IntroductionJourneyApi = ReturnType<typeof useIntroductionJourney>
