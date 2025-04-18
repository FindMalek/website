"use client"

import { useEffect } from "react"
import type { ToolInvocation } from "ai"

import { type MeetingSchedulerValues } from "@/config/schemas"
import { formatDate } from "@/lib/utils"
import { useMeetingScheduler } from "@/hooks/use-meeting-scheduler"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
  const {
    form,
    state,
    askForAvailability,
    generateTimeSlots,
    scheduleMeeting,
  } = useMeetingScheduler(toolCall)

  useEffect(() => {
    askForAvailability()
  }, [askForAvailability])

  const timeSlots = generateTimeSlots()
  const onSubmit = (values: MeetingSchedulerValues) => {
    scheduleMeeting(values)
  }

  if (state.isScheduled) {
    return (
      <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
        <div className="flex items-center space-x-2 text-green-600">
          <Icons.check className="h-5 w-5" />
          <p className="font-medium">Meeting scheduled!</p>
        </div>
        <div className="bg-background mt-2 rounded-md p-3">
          <p className="text-sm font-medium">Details:</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Date: {formatDate(form.getValues("date"))}
          </p>
          <p className="text-muted-foreground text-sm">
            Time: {form.getValues("timeSlot")}
          </p>
          <p className="text-muted-foreground text-sm">
            Duration: {form.getValues("duration")} minutes
          </p>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          You&apos;ll receive a confirmation email with the meeting link
          shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Schedule a Meeting</h3>

      {state.showingCalendar && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="date">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="date">Select Date</TabsTrigger>
                <TabsTrigger value="time" disabled={!form.watch("date")}>
                  Select Time
                </TabsTrigger>
              </TabsList>

              <TabsContent value="date" className="py-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormControl>
                        {/* TODO: Use motion-emr calendar component */}
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="mx-auto"
                          disabled={(date) => {
                            // Disable weekends and past dates
                            const day = date.getDay()
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return day === 0 || day === 6 || date < today
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="time" className="space-y-4 py-2">
                {form.watch("date") && (
                  <>
                    <FormField
                      control={form.control}
                      name="timeSlot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Available Time Slots for{" "}
                            {form.getValues("date")?.toLocaleDateString()}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Duration</FormLabel>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant={
                                field.value === "15" ? "default" : "outline"
                              }
                              className="flex-1"
                              onClick={() => field.onChange("15")}
                            >
                              15 min
                            </Button>
                            <Button
                              type="button"
                              variant={
                                field.value === "30" ? "default" : "outline"
                              }
                              className="flex-1"
                              onClick={() => field.onChange("30")}
                            >
                              30 min
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              disabled={
                state.isLoading ||
                !form.watch("date") ||
                !form.watch("timeSlot")
              }
              className="w-full"
            >
              {state.isLoading ? (
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
          </form>
        </Form>
      )}
    </div>
  )
}
