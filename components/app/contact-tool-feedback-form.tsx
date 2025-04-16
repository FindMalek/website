"use client"

import type React from "react"
import { useState } from "react"
import type { ToolInvocation } from "ai"
import { useChat } from "@ai-sdk/react"
import { Check, Loader2, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackFormProps {
  toolCall: ToolInvocation
}

export function ContactToolFeedbackForm({ toolCall }: FeedbackFormProps) {
  const [rating, setRating] = useState<string>("")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { addToolResult } = useChat()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API to save the feedback
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: true,
          rating,
          feedback,
        }),
      })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: false,
          error: "Failed to submit feedback",
        }),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
        <div className="flex items-center space-x-2 text-green-600">
          <Check className="h-5 w-5" />
          <p className="font-medium">Feedback submitted!</p>
        </div>
        <p className="text-muted-foreground text-sm">
          Thank you for your feedback. It helps me improve my services.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted/30 space-y-4 rounded-lg border p-4"
    >
      <h3 className="font-medium">Feedback Form</h3>

      <div className="space-y-2">
        <Label>How would you rate your experience?</Label>
        <RadioGroup value={rating} onValueChange={setRating}>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex flex-col items-center">
                <RadioGroupItem
                  value={value.toString()}
                  id={`rating-${value}`}
                />
                <Label htmlFor={`rating-${value}`} className="mt-1 text-sm">
                  {value}
                </Label>
              </div>
            ))}
          </div>
          <div className="text-muted-foreground mt-1 flex justify-between px-2 text-xs">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback">Additional feedback</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !rating}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Submit Feedback
          </>
        )}
      </Button>
    </form>
  )
}
