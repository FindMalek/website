"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"

import { JourneyPageContext } from "@/types"

interface InterviewContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  returnFocus: () => void
  context: JourneyPageContext | null
  setContext: (context: JourneyPageContext | null) => void
}

const InterviewContext = createContext<InterviewContextValue | null>(null)

export function useInterviewMode() {
  const ctx = useContext(InterviewContext)
  if (!ctx) {
    throw new Error("useInterviewMode must be used within InterviewProvider")
  }
  return ctx
}

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState<JourneyPageContext | null>(null)

  const returnTo = useRef<HTMLElement | null>(null)

  const open = useCallback(() => {
    returnTo.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setIsOpen(true)
  }, [])
  const returnFocus = useCallback(() => returnTo.current?.focus(), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setContext(null)
  }, [])

  const value = useMemo(
    () => ({ isOpen, open, close, returnFocus, context, setContext }),
    [isOpen, open, close, returnFocus, context]
  )

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  )
}
