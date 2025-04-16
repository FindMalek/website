"use client"

import type { Message } from "ai"
import { Bot, User } from "lucide-react"

import { cn } from "@/lib/utils"

import { ContactToolEmailForm } from "@/components/app/contact-tool-email-form"
import { ContactToolFeedbackForm } from "@/components/app/contact-tool-feedback-form"
import { ContactToolMeetingScheduler } from "@/components/app/contact-tool-meeting-scheduler"
import { ContactToolPricingEstimator } from "@/components/app/contact-tool-pricing-estimator"
import { ContactToolResumeGenerator } from "@/components/app/contact-tool-resume-generator"

interface ChatMessageProps {
  message: Message
}

type ToolInvocationState = "partial-call" | "call" | "result"

interface BaseToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
}

interface ToolInvocationResult extends BaseToolInvocation {
  state: "result"
  result: Record<string, unknown>
}

interface ToolInvocationUIPart {
  type: "tool-invocation"
  toolInvocation: {
    state: ToolInvocationState
    toolCallId: string
    toolName: string
    args: Record<string, unknown>
    result?: Record<string, unknown>
  }
}

export function ContactChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  const renderToolCall = (part: ToolInvocationUIPart) => {
    const { toolName, state } = part.toolInvocation

    if (state === "result" && part.toolInvocation.result) {
      const resultToolCall: ToolInvocationResult = {
        state: "result",
        toolCallId: part.toolInvocation.toolCallId,
        toolName: part.toolInvocation.toolName,
        args: part.toolInvocation.args,
        result: part.toolInvocation.result,
      }

      switch (toolName) {
        case "saveEmail":
          return <ContactToolEmailForm toolCall={resultToolCall} />
        case "scheduleMeeting":
          return <ContactToolMeetingScheduler toolCall={resultToolCall} />
        case "generatePricing":
          return <ContactToolPricingEstimator toolCall={resultToolCall} />
        case "generateResume":
          return <ContactToolResumeGenerator toolCall={resultToolCall} />
        case "submitFeedback":
          return <ContactToolFeedbackForm toolCall={resultToolCall} />
        default:
          return (
            <div className="text-muted-foreground text-sm">
              Tool {toolName} completed
            </div>
          )
      }
    }

    return (
      <div className="text-muted-foreground text-sm">
        {state === "call" && `Processing ${toolName}...`}
        {state === "partial-call" && `Preparing ${toolName}...`}
      </div>
    )
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
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "flex max-w-[80%] flex-col space-y-2",
          isUser && "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message.content}
        </div>

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
