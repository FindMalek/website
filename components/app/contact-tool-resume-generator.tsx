"use client"

import { type ToolCallLike } from "@/lib/tool-helpers"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

interface ResumeGeneratorProps {
  toolCall: ToolCallLike
}

/**
 * getResume runs server-side (see app/api/chat/route.ts) and streams its
 * result straight to this card -- no client-triggered fetch step, the
 * button just opens the link once the tool call has resolved.
 */
export function ContactToolResumeGenerator({ toolCall }: ResumeGeneratorProps) {
  const resumeUrl = toolCall.output?.resumeUrl as string | undefined

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">View Resume</h3>
      <p className="text-muted-foreground text-sm">
        Access my resume to see my professional experience and qualifications.
      </p>

      <Button
        variant="outline"
        className="w-full"
        disabled={!resumeUrl}
        onClick={() => resumeUrl && window.open(resumeUrl, "_blank")}
      >
        {resumeUrl ? (
          <>
            <Icons.download className="mr-2 h-4 w-4" />
            View Resume
          </>
        ) : (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        )}
      </Button>
    </div>
  )
}
