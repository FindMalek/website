import type { UIMessage } from "ai"

const TOOL_LABELS: Record<string, { pending: string; complete: string }> = {
  searchPortfolio: {
    pending: "Reading portfolio notes…",
    complete: "Portfolio notes checked",
  },
  getResume: { pending: "Preparing your CV…", complete: "CV ready" },
  getTodayDate: { pending: "Checking the date…", complete: "Date checked" },
  saveEmail: {
    pending: "Opening the contact form…",
    complete: "Contact form ready",
  },
  scheduleMeeting: {
    pending: "Opening the calendar…",
    complete: "Calendar ready",
  },
  generatePricing: {
    pending: "Preparing the project form…",
    complete: "Project form ready",
  },
}

export function getToolActivityLabel(name: string, complete = false): string {
  const labels = TOOL_LABELS[name]
  return labels
    ? complete
      ? labels.complete
      : labels.pending
    : complete
      ? "Action completed"
      : "Preparing an action…"
}

export function getChatActivityLabel(
  messages: UIMessage[],
  status: string,
  isCancelling: boolean
): string | null {
  if (isCancelling) return "Stopping the reply…"
  if (status !== "submitted" && status !== "streaming") return null
  const last = messages.at(-1)
  if (last?.role !== "assistant") return "Preparing a reply…"

  const hasPendingLookup = last.parts.some(
    (part) =>
      ["tool-searchPortfolio", "tool-getResume", "tool-getTodayDate"].includes(
        part.type
      ) &&
      "state" in part &&
      (part.state === "input-streaming" || part.state === "input-available")
  )
  if (hasPendingLookup) return null
  return last.parts.some((part) => part.type === "text" && part.text.length > 0)
    ? "Writing a reply…"
    : "Preparing a reply…"
}
