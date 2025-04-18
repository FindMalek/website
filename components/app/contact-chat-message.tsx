"use client"

import type { Message, ToolInvocation } from "ai"

import { ToolName } from "@/types/enum"

import { convertToolName } from "@/config/converter"
import { cn } from "@/lib/utils"

import { ContactToolEmailForm } from "@/components/app/contact-tool-email-form"
import { ContactToolMeetingScheduler } from "@/components/app/contact-tool-meeting-scheduler"
import { ContactToolPricingEstimator } from "@/components/app/contact-tool-pricing-estimator"
import { ContactToolResumeGenerator } from "@/components/app/contact-tool-resume-generator"
import { Icons } from "@/components/shared/icons"

interface ChatMessageProps {
  message: Message
}

type ToolInvocationState = "partial-call" | "call" | "result"

interface ToolInvocationUIPart {
  type: "tool-invocation"
  toolInvocation: {
    state: ToolInvocationState
    toolCallId: string
    toolName: ToolName
    args: Record<string, unknown>
    result?: Record<string, unknown>
  }
}

export function ContactChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  const renderToolCall = (part: ToolInvocationUIPart) => {
    const { toolName, state, toolCallId, args, result } = part.toolInvocation

    if (state === "partial-call") {
      return (
        <div className="text-muted-foreground flex items-center space-x-2 text-sm">
          <Icons.spinner className="h-4 w-4 animate-spin" />
          <span>Preparing {convertToolName(toolName)}...</span>
        </div>
      )
    }

    const toolCall: ToolInvocation = {
      toolCallId,
      toolName,
      args,
      state: state === "call" ? "call" : "result",
      result: result || {},
    }

    try {
      switch (toolName) {
        case "saveEmail":
          return <ContactToolEmailForm toolCall={toolCall} />
        case "scheduleMeeting":
          return <ContactToolMeetingScheduler toolCall={toolCall} />
        case "generatePricing":
          return <ContactToolPricingEstimator toolCall={toolCall} />
        case "getResume":
          return <ContactToolResumeGenerator toolCall={toolCall} />
        default:
          return (
            <div className="text-muted-foreground text-sm">
              {state === "call" && `Processing ${convertToolName(toolName)}...`}
              {state === "result" && `${convertToolName(toolName)} completed`}
            </div>
          )
      }
    } catch (error) {
      console.error(`Error rendering tool ${toolName}:`, error)
      return (
        <div className="text-destructive text-sm">
          Error displaying {convertToolName(toolName)}. Please try again.
        </div>
      )
    }
  }

  return (
    <div
      className={cn(
        "mb-4 flex items-start gap-3",
        isUser && "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          isUser ? "bg-background" : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? (
          <Icons.user className="size-5" />
        ) : (
          <Icons.logo className="size-8 rounded-md" />
        )}
      </div>
      <div
        className={cn(
          "flex max-w-[80%] flex-col space-y-2",
          isUser && "items-end"
        )}
      >
        {message.content.length > 0 && (
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {message.content}
          </div>
        )}

        {message.parts?.map((part, index) => {
          if (part.type === "tool-invocation") {
            return (
              <div key={index} className="w-full">
                {renderToolCall(part as ToolInvocationUIPart)}
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
