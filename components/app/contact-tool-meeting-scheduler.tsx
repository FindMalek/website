"use client"

import { useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { ToolInvocation } from "ai"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MeetingSchedulerProps {
  toolCall: ToolInvocation
}

export function ContactToolMeetingScheduler({
  toolCall,
}: MeetingSchedulerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [askingAvailability, setAskingAvailability] = useState(true)
  const [showingCalendar, setShowingCalendar] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [duration, setDuration] = useState<string>("30")
  const { addToolResult, setInput, handleSubmit: chatSubmit } = useChat()

  // Start by asking when they're available
  useEffect(() => {
    if (askingAvailability) {
      setInput("When are you available for a meeting?")
      chatSubmit()
      setAskingAvailability(false)
      setShowingCalendar(true)
    }
  }, [askingAvailability, setInput, chatSubmit])

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    const slots = []
    // Start at 9 AM, end at 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (const minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeString)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleScheduleMeeting = async () => {
    if (!date || !timeSlot) return
    
    setIsLoading(true)

    try {
      // In a real implementation, this would call a calendar API
      // For now, we'll simulate a successful scheduling
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsScheduled(true)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: true,
          meetingDate: date.toISOString(),
          meetingTime: timeSlot,
          duration: `${duration} minutes`,
          meetingUrl: "https://cal.com/yourusername/meeting",
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
          <Icons.check className="h-5 w-5" />
          <p className="font-medium">Meeting scheduled!</p>
        </div>
        <div className="bg-background rounded-md p-3 mt-2">
          <p className="text-sm font-medium">Details:</p>
          <p className="text-muted-foreground text-sm mt-1">
            Date: {date?.toLocaleDateString()}
          </p>
          <p className="text-muted-foreground text-sm">
            Time: {timeSlot}
          </p>
          <p className="text-muted-foreground text-sm">
            Duration: {duration} minutes
          </p>
        </div>
        <p className="text-muted-foreground text-sm mt-2">
          You&apos;ll receive a confirmation email with the meeting link shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Schedule a Meeting</h3>
      
      {showingCalendar && (
        <div className="space-y-4">
          <Tabs defaultValue="date">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="date">Select Date</TabsTrigger>
              <TabsTrigger value="time" disabled={!date}>Select Time</TabsTrigger>
            </TabsList>
            <TabsContent value="date" className="py-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="mx-auto"
                disabled={(date) => {
                  // Disable weekends and past dates
                  const day = date.getDay()
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return day === 0 || day === 6 || date < today
                }}
              />
            </TabsContent>
            <TabsContent value="time" className="py-2 space-y-4">
              {date && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Available Time Slots for {date.toLocaleDateString()}</p>
                    <Select value={timeSlot} onValueChange={setTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Meeting Duration</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant={duration === "15" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setDuration("15")}
                      >
                        15 min
                      </Button>
                      <Button 
                        variant={duration === "30" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setDuration("30")}
                      >
                        30 min
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleScheduleMeeting}
            disabled={isLoading || !date || !timeSlot}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Icons.calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
