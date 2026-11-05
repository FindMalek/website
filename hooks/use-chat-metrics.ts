import { useEffect, useRef, useState } from "react"
import type { UIMessage } from "ai"

import { getMessageText } from "@/lib/utils"

/** A rough token estimate: about four characters per token for English text. */
export const estimateTokens = (text: string): number => Math.ceil(text.length / 4)

export type ChatMetrics = {
  /** Milliseconds each assistant reply took, by message id. */
  timings: Record<string, number>
  /** Elapsed time of the reply being generated right now, or 0. */
  liveMs: number
  /** Duration of the most recent finished reply, or null. */
  lastMs: number | null
  /** Estimated tokens across the whole conversation. */
  tokens: number
}

/**
 * Terminal-style session stats: how long each reply took (measured from the
 * moment the request started to the moment it finished) and a token estimate.
 */
export function useChatMetrics(messages: UIMessage[], isLoading: boolean): ChatMetrics {
  const startedAt = useRef<number | null>(null)
  const [timings, setTimings] = useState<Record<string, number>>({})
  const [lastMs, setLastMs] = useState<number | null>(null)
  const [liveMs, setLiveMs] = useState(0)
  const latest = useRef(messages)
  useEffect(() => {
    latest.current = messages
  })

  useEffect(() => {
    if (isLoading) {
      startedAt.current = performance.now()
      const timer = setInterval(() => {
        if (startedAt.current !== null) setLiveMs(performance.now() - startedAt.current)
      }, 100)
      return () => clearInterval(timer)
    }
    if (startedAt.current !== null) {
      const ms = performance.now() - startedAt.current
      startedAt.current = null
      const last = [...latest.current].reverse().find((m) => m.role === "assistant")
      setLiveMs(0)
      setLastMs(ms)
      if (last) setTimings((t) => ({ ...t, [last.id]: ms }))
    }
  }, [isLoading])

  const tokens = messages.reduce((sum, m) => sum + estimateTokens(getMessageText(m)), 0)
  return { timings, liveMs, lastMs, tokens }
}
