"use client"

import type { ToolInvocation } from "ai"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"



export function ContactToolMeetingScheduler() {
  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Schedule a Meeting</h3>

      <p className="text-sm">
        You can schedule a meeting with me directly through my calendar.
      </p>

      <a href="https://cal.com/findmalek" target="_blank" rel="noopener noreferrer">
        <Button className="w-full">
          <Icons.calendar className="mr-2 h-4 w-4" />
          Open My Calendar
        </Button>
      </a>

      <p className="text-muted-foreground text-xs mt-2">
        Select a convenient time slot from my available schedule.
      </p>
    </div>
  )
}
