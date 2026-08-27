import type { UIMessage } from "ai"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { ProjectStatus } from "@/types/enum"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Steady-state sticky header height, once scrolled -- matches the
// `scroll-margin-top` fallback used everywhere else (Panel, SectionHeading,
// PageHeading all fall back to 6rem). Deliberately NOT read from the live
// `--header-height` CSS variable: that variable is scroll-position-dependent
// (hooks/use-header-animation.ts recomputes it on every scroll event, and
// near the top of the page it includes the full expanded hero/avatar area,
// not just the header). scrollIntoView()'s `scroll-margin-top` offset is
// computed once at call time, so reading the live variable from wherever
// the click happened to originate baked in whatever oversized offset was
// current at the top of the page -- under-scrolling by that whole amount.
const STICKY_HEADER_OFFSET_PX = 96

/**
 * Handles a nav click on a homepage-anchor href (e.g. "/#work") when the
 * visitor is already on the target path. next/link's built-in hash
 * scrolling only fires on an actual route transition -- a same-pathname,
 * hash-only click (already on "/", clicking "/#work") doesn't reliably
 * scroll, since the router sees no navigation to act on. Returns true if
 * it handled the scroll (caller should preventDefault), false if this
 * wasn't a same-page hash link and next/link should handle it normally.
 */
export function scrollToAnchorSection(href: string, pathname: string) {
  const hashIndex = href.indexOf("#")
  if (hashIndex === -1) return false

  const targetPath = href.slice(0, hashIndex) || "/"
  if (targetPath !== pathname) return false

  const targetId = href.slice(hashIndex + 1)
  const target = document.getElementById(targetId)
  if (!target) return false

  const top =
    target.getBoundingClientRect().top + window.scrollY - STICKY_HEADER_OFFSET_PX
  window.scrollTo({ top, behavior: "smooth" })
  return true
}

export function clamp(number: number, a: number, b: number) {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return Math.min(Math.max(number, min), max)
}

export function remToPx(remValue: string) {
  const rootFontSize =
    typeof window === "undefined"
      ? 16
      : parseFloat(window.getComputedStyle(document.documentElement).fontSize)

  return parseFloat(remValue) * rootFontSize
}

/**
 * Status priority map where lower numbers indicate higher priority
 */
export const statusPriority: Record<ProjectStatus, number> = {
  published: 1,
  wip: 2,
  "on-hold": 3,
  draft: 4,
}

/**
 * Sort projects by status priority (published first) then by id
 */
export function sortProjectsByStatus<
  T extends { status: ProjectStatus; id: number },
>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    // Compare by status priority (lower value = higher priority)
    const statusDiff = statusPriority[a.status] - statusPriority[b.status]
    // If same status, sort by id
    return statusDiff !== 0 ? statusDiff : a.id - b.id
  })
}

/**
 * Sort open source projects by stars (most stars first)
 */
export function sortProjectsByStars<T extends { stars: number }>(
  projects: T[]
): T[] {
  return [...projects].sort((a, b) => b.stars - a.stars)
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Parse date string in format "Month, Year" (e.g., "September, 2024")
 * Returns a Date object for comparison
 */
function parseWorkDate(dateString: string): Date {
  if (dateString.toLowerCase() === "present") {
    // Return a future date for "Present" to ensure it sorts to the top
    return new Date(9999, 11, 31)
  }

  // Parse "Month, Year" format
  const [month, year] = dateString.split(", ")
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth()
  return new Date(parseInt(year), monthIndex, 1)
}

/**
 * Sort work experiences by date with the following logic:
 * 1. Current positions (endDate = "Present") appear first
 * 2. Among current positions, sort by most recent startDate
 * 3. Past positions sorted by most recent endDate
 * 4. If endDates are equal, sort by most recent startDate
 */
export function sortWorkExperiences<
  T extends { startDate: string; endDate: string },
>(works: T[]): T[] {
  return [...works].sort((a, b) => {
    const aEndDate = parseWorkDate(a.endDate)
    const bEndDate = parseWorkDate(b.endDate)
    const aStartDate = parseWorkDate(a.startDate)
    const bStartDate = parseWorkDate(b.startDate)

    // Compare end dates (most recent first)
    const endDateDiff = bEndDate.getTime() - aEndDate.getTime()

    if (endDateDiff !== 0) {
      return endDateDiff
    }

    // If end dates are equal, compare start dates (most recent first)
    return bStartDate.getTime() - aStartDate.getTime()
  })
}

/**
 * Extracts the plain-text content of a UIMessage by concatenating its
 * text parts. UIMessages have no top-level `content` string (AI SDK v5+).
 */
export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
}

function textPart(text: string): UIMessage["parts"][number] {
  return { type: "text", text }
}

export function sanitizeMessages(messages: UIMessage[]): UIMessage[] {
  // First pass: detect context reset messages
  const hasContextReset = messages.some(
    (msg) =>
      msg.role === "system" &&
      getMessageText(msg).includes(
        "previous conversation thread has been reset"
      )
  )

  // Filter out system messages used for context resets
  const filteredMessages = messages.filter(
    (msg) =>
      !(
        msg.role === "system" &&
        getMessageText(msg).includes(
          "previous conversation thread has been reset"
        )
      )
  )

  return filteredMessages.map((message) => {
    // Skip user messages
    if (message.role === "user") {
      return message
    }

    const text = getMessageText(message)

    // Check for context reset messages from assistant
    const isContextResetMessage =
      message.role === "assistant" &&
      (text.includes("Let's start fresh") ||
        text.includes("I understand you want to change the topic"))

    // Keep context reset messages as they are important signals
    if (isContextResetMessage) {
      return message
    }

    // A message has a pending tool call if any tool part hasn't finished yet
    const hasPendingToolCall = message.parts.some(
      (part) =>
        part.type.startsWith("tool-") &&
        "state" in part &&
        (part.state === "input-streaming" || part.state === "input-available")
    )

    // If message has a pending tool call, sanitize it
    if (hasPendingToolCall) {
      console.log("Found pending tool call, sanitizing message")

      // Replace with a clean text-only message with better context reset
      // hints for the model
      return {
        id: message.id,
        role: message.role,
        parts: [
          textPart(
            hasContextReset
              ? "Let's start with a completely new topic. How can I help you now?"
              : "I'm ready to help you with something else."
          ),
        ],
      }
    }

    // Message is clean, return as is
    return message
  })
}

/**
 * Calculate the duration between two dates in years and months
 * Returns an object with years and months
 */
export function calculateWorkDuration(
  startDate: string,
  endDate: string
): { years: number; months: number; totalMonths: number } {
  const start = parseWorkDate(startDate)
  const end =
    endDate.toLowerCase() === "present"
      ? new Date() // Use current date for "Present"
      : parseWorkDate(endDate)

  // Calculate total months
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  return { years, months, totalMonths }
}

/**
 * Format work duration as a human-readable string
 * Examples: "2 years 3 months", "1 year", "6 months", "1 month"
 */
export function formatWorkDuration(startDate: string, endDate: string): string {
  const { years, months } = calculateWorkDuration(startDate, endDate)

  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`)
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`)
  }

  // If less than a month, show "Less than a month"
  if (years === 0 && months === 0) {
    return "Less than a month"
  }

  return parts.join(" ")
}

/**
 * Initials for an avatar fallback, e.g. "Jane Placeholder" -> "JP".
 * Falls back to the first character if the name is a single word.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return ""
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export interface WorkExperienceGroup<T> {
  company: string
  logo: string
  logoClassName?: string
  link?: string
  location?: string
  isCurrentEmployer: boolean
  positions: T[]
}

/**
 * Group an already-sorted flat list of work experiences by company,
 * preserving each company's position order. A company is flagged as the
 * current employer if any of its positions has endDate "Present".
 */
export function groupWorkByCompany<
  T extends {
    company: string
    logo: string
    logoClassName?: string
    link?: string
    location?: string
    endDate: string
  },
>(works: T[]): WorkExperienceGroup<T>[] {
  const groups: WorkExperienceGroup<T>[] = []

  for (const work of works) {
    const existing = groups.find((group) => group.company === work.company)

    if (existing) {
      existing.positions.push(work)
      if (work.endDate.toLowerCase() === "present") {
        existing.isCurrentEmployer = true
      }
    } else {
      groups.push({
        company: work.company,
        logo: work.logo,
        logoClassName: work.logoClassName,
        link: work.link,
        location: work.location,
        isCurrentEmployer: work.endDate.toLowerCase() === "present",
        positions: [work],
      })
    }
  }

  return groups
}
