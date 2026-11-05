"use client"

import type { UIMessage } from "ai"

import { ToolName } from "@/types/enum"

import { convertToolName } from "@/config/converter"
import { ToolCallLike } from "@/lib/tool-helpers"
import { estimateTokens } from "@/hooks/use-chat-metrics"
import { getMessageText } from "@/lib/utils"

import { ContactToolEmailForm } from "@/components/app/contact-tool-email-form"
import { ContactToolMeetingScheduler } from "@/components/app/contact-tool-meeting-scheduler"
import { ContactToolPricingEstimator } from "@/components/app/contact-tool-pricing-estimator"
import { ContactToolResumeGenerator } from "@/components/app/contact-tool-resume-generator"
import { Icons } from "@/components/shared/icons"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ui/message"

interface ChatMessageProps {
  message: UIMessage
  /** Terminal-style stats shown under an assistant reply. */
  meta?: { ms?: number }
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

export function ContactChatMessage({ message, meta }: ChatMessageProps) {
  const isUser = message.role === "user"
  const text = getMessageText(message)

  const renderToolCall = (part: ToolPart) => {
    const toolName = part.type.slice("tool-".length) as ToolName
    const { state, toolCallId, input, output } = part

    if (state === "input-streaming") {
      return (
        <div className="text-muted-foreground flex items-center space-x-2 text-sm">
          <Icons.spinner className="size-4" />
          <span>preparing {convertToolName(toolName)}...</span>
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

  const seconds = meta?.ms !== undefined ? (meta.ms / 1000).toFixed(1) : null

  if (isUser) {
    return (
      <p className="mb-4 font-mono text-sm">
        <span className="text-chart-1">visitor@findmalek</span>
        <span className="text-muted-foreground">:~$</span>{" "}
        <span className="font-medium">{text}</span>
      </p>
    )
  }

  return (
    <div className="mb-4 font-mono text-sm">
      <p className="text-muted-foreground text-xs">
        malek@findmalek<span>:~$</span> reply
      </p>
      <div className="border-foreground/20 mt-1 border-l pl-3">
        <Message from={message.role} className="max-w-full">
          {text.length > 0 && (
            <MessageContent>
              <MessageResponse>{text}</MessageResponse>
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
        {seconds && (
          <p className="text-muted-foreground mt-2 text-xs tabular-nums">
            [{seconds}s · ~{estimateTokens(text)} tokens]
          </p>
        )}
      </div>
    </div>
  )
}
