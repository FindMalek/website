"use client"

import type { ToolInvocation } from "ai"

import { useResumeGenerator } from "@/hooks/use-resume-generator"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

interface ResumeGeneratorProps {
  toolCall: ToolInvocation
}

export function ContactToolResumeGenerator({ toolCall }: ResumeGeneratorProps) {
  const { state, generateResume } = useResumeGenerator(toolCall)

  const handleOpenResume = () => {
    if (state.resumeUrl) {
      window.open(state.resumeUrl, "_blank")
    }
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">View Resume</h3>
      <p className="text-muted-foreground text-sm">
        Access my resume to see my professional experience and qualifications.
      </p>

      {state.resumeUrl ? (
        <Button variant="outline" className="w-full" onClick={handleOpenResume}>
          <Icons.download className="mr-2 h-4 w-4" />
          View Resume
        </Button>
      ) : (
        <Button
          onClick={generateResume}
          disabled={state.isGenerating}
          className="w-full"
        >
          {state.isGenerating ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Icons.file className="mr-2 h-4 w-4" />
              Get Resume
            </>
          )}
        </Button>
      )}
    </div>
  )
}
