"use client"

import { useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { ToolInvocation } from "ai"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EmailFormProps {
  toolCall: ToolInvocation
}

export function ContactToolEmailForm({ toolCall }: EmailFormProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [askingPurpose, setAskingPurpose] = useState(true)
  const [askingDetails, setAskingDetails] = useState(false)
  const [askingConfirmation, setAskingConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [message, setMessage] = useState("")
  const { addToolResult, messages, setInput, handleSubmit: chatSubmit } = useChat()

  // Start by asking what they want to contact about
  useEffect(() => {
    if (askingPurpose) {
      setInput("What would you like to contact me about?")
      chatSubmit()
    }
  }, [askingPurpose, setInput, chatSubmit])

  const moveToDetailsStep = () => {
    setAskingPurpose(false)
    setAskingDetails(true)
    
    // Extract the purpose from the conversation
    const userMessages = messages.filter(msg => msg.role === "user")
    if (userMessages.length > 0) {
      setMessage(userMessages[userMessages.length - 1].content)
    }
  }

  const moveToConfirmationStep = () => {
    setAskingDetails(false)
    setAskingConfirmation(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Get the conversation history
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          message,
          conversation: conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      const result = await response.json()

      setIsSubmitted(true)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: true,
          email,
          name,
          ownerEmailSent: result.ownerEmailSent,
          userEmailSent: result.userEmailSent,
        }),
      })
    } catch (error) {
      console.error("Error sending email:", error)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: false,
          error: "Failed to send email",
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
          <Icons.check className="h-5 w-5" />
          <p className="font-medium">Email sent successfully!</p>
        </div>
        <p className="text-muted-foreground text-sm">
          Thank you for reaching out. I&apos;ll get back to you as soon as
          possible. A confirmation has been sent to your email.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Contact Information</h3>

      {askingPurpose && (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Please share what you would like to contact me about.
          </p>
          <Button onClick={moveToDetailsStep} className="w-full">
            <Icons.arrowRight className="mr-2 h-4 w-4" />
            Continue
          </Button>
        </div>
      )}

      {askingDetails && (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">Your Name</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm">Your Email</p>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <Button 
            onClick={moveToConfirmationStep} 
            disabled={!email || !name}
            className="w-full"
          >
            <Icons.arrowRight className="mr-2 h-4 w-4" />
            Continue
          </Button>
        </div>
      )}

      {askingConfirmation && (
        <div className="space-y-4">
          <div className="bg-background rounded-md p-3">
            <p className="text-sm font-medium">Message:</p>
            <p className="text-muted-foreground text-sm mt-1">{message}</p>
            <div className="mt-3">
              <p className="text-sm font-medium">From:</p>
              <p className="text-muted-foreground text-sm">{name} ({email})</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Would you like to send this message?
          </p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setAskingDetails(true)}
            >
              Edit Details
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icons.send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
