"use client"

import { useEffect } from "react"
import type { ToolInvocation } from "ai"

import { type EmailFormValues } from "@/config/schemas"
import { useEmailForm } from "@/hooks/use-email-form"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface EmailFormProps {
  toolCall: ToolInvocation
}

export function ContactToolEmailForm({ toolCall }: EmailFormProps) {
  const {
    form,
    state,
    updateState,
    askForPurpose,
    moveToDetailsStep,
    moveToConfirmationStep,
    submitEmail,
  } = useEmailForm(toolCall)

  useEffect(() => {
    askForPurpose()
  }, [askForPurpose])

  const onSubmit = (values: EmailFormValues) => {
    submitEmail(values)
  }

  if (state.isSubmitted) {
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

      {state.askingPurpose && (
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

      {state.askingDetails && (
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your.email@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button onClick={() => moveToConfirmationStep()} className="w-full">
              <Icons.arrowRight className="mr-2 h-4 w-4" />
              Continue
            </Button>
          </form>
        </Form>
      )}

      {state.askingConfirmation && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-background rounded-md p-3">
              <p className="text-sm font-medium">Message:</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {form.getValues("message")}
              </p>
              <div className="mt-3">
                <p className="text-sm font-medium">From:</p>
                <p className="text-muted-foreground text-sm">
                  {form.getValues("name")} ({form.getValues("email")})
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Would you like to send this message?
            </p>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => updateState("askingDetails", true)}
              >
                Edit Details
              </Button>
              <Button
                type="submit"
                disabled={state.isSubmitting}
                className="flex-1"
              >
                {state.isSubmitting ? (
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
          </form>
        </Form>
      )}
    </div>
  )
}
