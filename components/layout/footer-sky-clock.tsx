"use client"

import { useSyncExternalStore } from "react"

import { getTunisSky } from "@/lib/tunis-sky"
import { cn } from "@/lib/utils"

const MINUTE = 60_000

// A minute-granular clock as an external store: the server snapshot is null,
// so the label only renders after hydration and never mismatches.
function subscribeToMinutes(onChange: () => void): () => void {
  let timeout: ReturnType<typeof setTimeout>
  const schedule = (): void => {
    timeout = setTimeout(
      () => {
        onChange()
        schedule()
      },
      MINUTE - (Date.now() % MINUTE) + 50
    )
  }
  schedule()
  return () => clearTimeout(timeout)
}

function currentMinute(): number {
  return Math.floor(Date.now() / MINUTE)
}

function serverMinute(): null {
  return null
}

export function FooterSkyClock({ className }: { className?: string }) {
  const minute = useSyncExternalStore(
    subscribeToMinutes,
    currentMinute,
    serverMinute
  )
  if (minute === null) return null

  const { phase, stops, time } = getTunisSky(new Date(minute * MINUTE))

  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]",
        className
      )}
    >
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-[1px]"
        style={{
          backgroundImage: `linear-gradient(90deg, ${stops.join(", ")})`,
          boxShadow: `0 0 8px ${stops[1]}66`,
        }}
      />
      <span>
        Tunis · <time dateTime={time}>{time}</time>
      </span>
      <span className="text-muted-foreground/60">{phase}</span>
    </span>
  )
}
