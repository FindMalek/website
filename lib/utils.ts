import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { ProjectStatus } from "@/types/enum"
import { ChatMessage, ToolData } from "@/types"

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

export function sanitizeMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((message) => {
    // Skip user messages
    if (message.role === "user") {
      return message
    }

    // Function to check if a message contains a pending tool call
    const hasPendingToolCall = (msg: ChatMessage): boolean => {
      // Check toolInvocations property
      if (msg.toolInvocations && Array.isArray(msg.toolInvocations)) {
        if (
          msg.toolInvocations.some(
            (tool: ToolData) => tool.state === "call" && !tool.result
          )
        ) {
          return true
        }
      }

      // Check toolCalls property
      if (msg.toolCalls && Array.isArray(msg.toolCalls)) {
        if (
          msg.toolCalls.some(
            (tool: ToolData) => tool.state === "call" && !tool.result
          )
        ) {
          return true
        }
      }

      // Check parts array for tool invocations
      if (msg.parts && Array.isArray(msg.parts)) {
        for (const part of msg.parts) {
          if (
            part.type === "tool-invocation" &&
            part.toolInvocation?.state === "call" &&
            !part.toolInvocation?.result
          ) {
            return true
          }
        }
      }

      return false
    }

    // If message has a pending tool call, sanitize it
    if (hasPendingToolCall(message)) {
      console.log("Found pending tool call, sanitizing message")

      // Create a clean version of the message
      return {
        role: message.role,
        content: "I'm ready to help you with something else.",
        id: message.id,
      }
    }

    // Message is clean, return as is
    return message
  })
}
