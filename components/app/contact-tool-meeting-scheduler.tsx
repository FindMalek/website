"use client"

import { useState } from "react"
import type { ToolInvocation } from "ai"
import { useChat } from "ai/react"
import { Calendar, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface MeetingSchedulerProps {
  toolCall: ToolInvocation
}

export function ContactToolMeetingScheduler({
  toolCall,
}: MeetingSchedulerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const { addToolResult } = useChat()

  const handleScheduleMeeting = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, this would redirect to Cal.com or use their API
      // For now, we'll simulate a successful scheduling
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsScheduled(true)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: true,
          meetingUrl: "https://cal.com/yourusername/30min",
        }),
      })
    } catch (error) {
      console.error("Error scheduling meeting:", error)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: false,
          error: "Failed to schedule meeting",
        }),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isScheduled) {
    return (
      <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
        <div className="flex items-center space-x-2 text-green-600">
          <Check className="h-5 w-5" />
          <p className="font-medium">Meeting scheduled!</p>
        </div>
        <p className="text-muted-foreground text-sm">
          Your meeting has been scheduled. You&apos;ll receive a confirmation
          email shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Schedule a Meeting</h3>
      <p className="text-muted-foreground text-sm">
        Click the button below to schedule a 30-minute consultation.
      </p>

      <Button
        onClick={handleScheduleMeeting}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scheduling...
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Meeting
          </>
        )}
      </Button>
    </div>
  )
}
