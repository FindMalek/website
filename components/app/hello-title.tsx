"use client"

import { useSyncExternalStore } from "react"

const ID = "hello-greeting"
const SSR_TEXT = "Hello"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function runGreetingScript(elementId: string, compute: typeof getGreeting) {
  try {
    const el = document.getElementById(elementId)
    if (el) el.textContent = compute()
  } catch {}
}

// Serializes two pure, developer-authored functions (no user input) via
// .toString() into a blocking inline script so the correct local-time
// greeting paints before hydration -- no flash of "Hello" on slow
// connections. Safe: the script body is fixed source code, not
// interpolated user data.
function getInlineScript(elementId: string) {
  return `(${runGreetingScript.toString()})(${JSON.stringify(elementId)},${getGreeting.toString()})`
}

export function HelloTitle({ className }: { className?: string }) {
  // Server always renders "Hello" (no reliable visitor-local-time on the
  // server); the client snapshot resolves the real greeting, which also
  // covers client-side navigation back to this component.
  const greeting = useSyncExternalStore(
    () => () => {},
    getGreeting,
    () => SSR_TEXT
  )

  return (
    <>
      <h2 id={ID} className={className} suppressHydrationWarning>
        {greeting}
      </h2>
      {/* eslint-disable-next-line react/no-danger */}
      <script dangerouslySetInnerHTML={{ __html: getInlineScript(ID) }} />
    </>
  )
}
