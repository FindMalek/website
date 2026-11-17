"use client"

import type { UIMessage } from "ai"

import { getToolActivityLabel } from "@/lib/chatbot-activity"
import { ToolCallLike } from "@/lib/tool-helpers"
import { cn, getMessageText } from "@/lib/utils"

import { ChatActivityStatus } from "@/components/app/chat-activity-status"
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
    const toolName = part.type.slice("tool-".length)
    const { state, toolCallId, input, output } = part

    if (state === "output-error") {
      return (
        <div className="text-destructive text-xs" role="status">
          Couldn&apos;t complete this action. You can try again or email
          hi@findmalek.com.
        </div>
      )
    }

    const isServerTool = [
      "searchPortfolio",
      "getResume",
      "getTodayDate",
    ].includes(toolName)
    if (
      state === "input-streaming" ||
      (isServerTool && state === "input-available")
    ) {
      return <ChatActivityStatus label={getToolActivityLabel(toolName)} />
    }

    if (part.type === "tool-searchPortfolio" && state === "output-available") {
      return (
        <p className="text-muted-foreground text-xs">Portfolio notes checked</p>
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
          return <p className="text-muted-foreground text-xs">Date checked</p>
        default:
          return (
            <div className="text-muted-foreground text-sm">
              {getToolActivityLabel(toolName, state === "output-available")}
            </div>
          )
      }
    } catch (error) {
      console.error(`Error rendering tool ${toolName}:`, error)
      return (
        <div className="text-destructive text-sm">
          Could not display this action. Please try again.
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

      <Message from={message.role} className="max-w-[85%]">
        {isUser && text.length > 0 && <MessageContent>{text}</MessageContent>}
        {!isUser &&
          message.parts.map((part, index) => {
            if (part.type === "text" && part.text.length > 0) {
              return (
                <MessageContent key={index}>
                  <MessageResponse>{part.text}</MessageResponse>
                </MessageContent>
              )
            }
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
