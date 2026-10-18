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
  const downloadUrl = toolCall.output?.downloadUrl as string | undefined

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">My resume</h3>
      <p className="text-muted-foreground text-sm">
        Read it online or grab the PDF.
      </p>

      {resumeUrl ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="flex-1" asChild>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <Icons.link className="mr-2 h-4 w-4" />
              View CV
            </a>
          </Button>
          {downloadUrl && (
            <Button variant="outline" className="flex-1" asChild>
              <a href={downloadUrl} download>
                <Icons.download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
          )}
        </div>
      ) : (
        <Button variant="outline" className="w-full" disabled>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      )}
    </div>
  )
}
