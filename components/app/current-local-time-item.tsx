"use client"

import { useEffect, useId, useState } from "react"

import { Icons } from "@/components/shared/icons"

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
} from "@/components/app/intro-item"

interface CurrentLocalTimeItemProps {
  timeZone: string
}

// Self-contained (globals + args only) so it can be serialized via
// .toString() into the pre-hydration script as well as called directly
// from the effect -- same technique already shipped in hello-title.tsx.
function computeClock(timeZone: string) {
  const now = new Date()

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(now)

  const viewerOffset = -now.getTimezoneOffset()
  const targetOffset =
    (new Date(now.toLocaleString("en-US", { timeZone })).getTime() -
      new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime()) /
    60000
  const hoursDiff = Math.abs(targetOffset - viewerOffset) / 60
  const diff =
    hoursDiff < 1
      ? " // same time"
      : ` // ${Math.floor(hoursDiff)}h ${targetOffset > viewerOffset ? "ahead" : "behind"}`

  return { time, diff }
}

function runClockScript(
  timeZone: string,
  ids: { time: string; diff: string },
  compute: typeof computeClock
) {
  try {
    const { time, diff } = compute(timeZone)
    const t = document.getElementById(ids.time)
    if (t) t.textContent = time
    const d = document.getElementById(ids.diff)
    if (d) d.textContent = diff
  } catch {}
}

// Blocking inline script that paints the viewer-local clock before
// hydration. The script body is fixed, developer-authored source with no
// interpolated user input -- safe for dangerouslySetInnerHTML.
function getInlineScript(timeZone: string, ids: { time: string; diff: string }) {
  return `(${runClockScript.toString()})(${JSON.stringify(timeZone)},${JSON.stringify(ids)},${computeClock.toString()})`
}

export function CurrentLocalTimeItem({ timeZone }: CurrentLocalTimeItemProps) {
  const uid = useId()
  const ids = { time: `lt-time-${uid}`, diff: `lt-diff-${uid}` }

  const [timeString, setTimeString] = useState("")
  const [diffText, setDiffText] = useState("")

  useEffect(() => {
    const update = () => {
      const { time, diff } = computeClock(timeZone)
      setTimeString(time)
      setDiffText(diff)
    }

    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [timeZone])

  return (
    <IntroItem>
      <IntroItemIcon>
        <Icons.clock />
      </IntroItemIcon>

      <IntroItemContent>
        <span id={ids.time} suppressHydrationWarning>
          {timeString}
        </span>
        <span
          id={ids.diff}
          className="text-muted-foreground"
          aria-hidden
          suppressHydrationWarning
        >
          {diffText}
        </span>
      </IntroItemContent>

      {/* eslint-disable-next-line react/no-danger */}
      <script
        dangerouslySetInnerHTML={{ __html: getInlineScript(timeZone, ids) }}
      />
    </IntroItem>
  )
}
