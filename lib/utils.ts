import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { ProjectStatus } from "@/types/enum"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  active: 1,
  wip: 2,
  "on-hold": 3,
  inactive: 4,
  draft: 5,
  archived: 6,
}

/**
 * Sort projects by status priority (active first) then by id
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
