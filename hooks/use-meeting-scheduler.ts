import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ToolInvocation } from "ai"
import { useForm } from "react-hook-form"

import {
  meetingSchedulerSchema,
  type MeetingSchedulerValues,
} from "@/config/schemas"
import { createToolResult, stringifyToolResult } from "@/lib/tool-helpers"
import { getGlobalChatContext } from "@/hooks/use-chat-with-tools"

interface MeetingState {
  isLoading: boolean
  isScheduled: boolean
  askingAvailability: boolean
  showingCalendar: boolean
}

export function useMeetingScheduler(toolCall: ToolInvocation) {
  const [state, setState] = useState<MeetingState>({
    isLoading: false,
    isScheduled: false,
    askingAvailability: true,
    showingCalendar: false,
  })

  const form = useForm<MeetingSchedulerValues>({
    resolver: zodResolver(meetingSchedulerSchema),
    defaultValues: {
      duration: "30",
      timeSlot: "",
    },
  })

  // Get the global chat context
  const {
    addToolResult,
    setInput,
    handleSubmit: chatSubmit,
  } = getGlobalChatContext()

  // Helper function to update a single property in state
  const updateState = <K extends keyof MeetingState>(
    key: K,
    value: MeetingState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Ask when they're available
  const askForAvailability = () => {
    if (state.askingAvailability) {
      setInput("When are you available for a meeting?")
      chatSubmit()
      updateState("askingAvailability", false)
      updateState("showingCalendar", true)
    }
  }

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    const slots = []
    // Start at 9 AM, end at 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (const minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(timeString)
      }
    }
    return slots
  }

  // Schedule the meeting
  const scheduleMeeting = async (values: MeetingSchedulerValues) => {
    if (!values.date || !values.timeSlot) return

    updateState("isLoading", true)

    try {
      // In a real implementation, this would call a calendar API
      // For now, we'll simulate a successful scheduling
      await new Promise((resolve) => setTimeout(resolve, 1500))

      updateState("isScheduled", true)

      // Create and submit tool result
      const result = createToolResult(true, {
        meetingDate: values.date.toISOString(),
        meetingTime: values.timeSlot,
        duration: `${values.duration} minutes`,
        meetingUrl: "https://cal.com/yourusername/meeting",
      })

      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: stringifyToolResult(result),
      })
    } catch (error) {
      console.error("Error scheduling meeting:", error)

      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: stringifyToolResult(
          createToolResult(false, {
            error: "Failed to schedule meeting",
          })
        ),
      })
    } finally {
      updateState("isLoading", false)
    }
  }

  return {
    form,
    state,
    updateState,
    askForAvailability,
    generateTimeSlots,
    scheduleMeeting,
  }
}
