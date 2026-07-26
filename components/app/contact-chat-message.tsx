"use client"

import type { UIMessage } from "ai"

import { ToolName } from "@/types/enum"

import { convertToolName } from "@/config/converter"
import { ToolCallLike } from "@/lib/tool-helpers"
import { cn, getMessageText } from "@/lib/utils"

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import { ContactToolEmailForm } from "@/components/app/contact-tool-email-form"
import { ContactToolMeetingScheduler } from "@/components/app/contact-tool-meeting-scheduler"
import { ContactToolPricingEstimator } from "@/components/app/contact-tool-pricing-estimator"
import { ContactToolResumeGenerator } from "@/components/app/contact-tool-resume-generator"
import { Icons } from "@/components/shared/icons"

interface ChatMessageProps {
  message: UIMessage
}

type ToolPart = UIMessage["parts"][number] & {
  type: `tool-${string}`
  toolCallId: string
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error"
  input?: Record<string, unknown>
  output?: Record<string, unknown>
}

export function ContactChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const text = getMessageText(message)

  const renderToolCall = (part: ToolPart) => {
    const toolName = part.type.slice("tool-".length) as ToolName
    const { state, toolCallId, input, output } = part

    if (state === "input-streaming") {
      return (
        <div className="text-muted-foreground flex items-center space-x-2 text-sm">
          <Icons.spinner className="h-4 w-4 animate-spin" />
          <span>Preparing {convertToolName(toolName)}...</span>
        </div>
      )
    }

    const toolCall: ToolCallLike = {
      toolCallId,
      input: input || {},
      output: output || {},
    }

    try {
      switch (toolName) {
        case "saveEmail":
          return <ContactToolEmailForm toolCall={toolCall} />
        case "scheduleMeeting":
          return <ContactToolMeetingScheduler />
        case "generatePricing":
          return <ContactToolPricingEstimator toolCall={toolCall} />
        case "getResume":
          return <ContactToolResumeGenerator toolCall={toolCall} />
        case "getTodayDate":
          // getTodayDate is handled server-side, no UI needed
          return null
        default:
          return (
            <div className="text-muted-foreground text-sm">
              {state === "input-available" &&
                `Processing ${convertToolName(toolName)}...`}
              {state === "output-available" &&
                `${convertToolName(toolName)} completed`}
              {state === "output-error" &&
                `${convertToolName(toolName)} failed`}
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
          "hidden h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow md:flex",
          isUser ? "bg-background" : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? (
          <Icons.user className="size-5" />
        ) : (
          <Icons.logo className="aspect-square size-8 rounded-md object-cover" />
        )}
      </div>

      <Message from={message.role} className="max-w-[80%]">
        {text.length > 0 && (
          <MessageContent>
            {isUser ? text : <MessageResponse>{text}</MessageResponse>}
          </MessageContent>
        )}

        {message.parts.map((part, index) => {
          if (part.type.startsWith("tool-")) {
            return (
              <div key={index} className="w-full">
                {renderToolCall(part as ToolPart)}
              </div>
            )
          }
          return null
        })}
      </Message>
    </div>
  )
}
