"use client"

import { useState } from "react"
import type { ToolInvocation } from "ai"
import { useChat } from "ai/react"
import { Download, FileText, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ResumeGeneratorProps {
  toolCall: ToolInvocation
}

export function ContactToolResumeGenerator({ toolCall }: ResumeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const { addToolResult } = useChat()

  const handleGenerateResume = async () => {
    setIsGenerating(true)

    try {
      // In a real implementation, this would call an API to generate a PDF
      // For now, we'll simulate a successful generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would be a URL to the generated PDF
      setResumeUrl("/sample-resume.pdf")

      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: true,
          resumeUrl: "/sample-resume.pdf",
        }),
      })
    } catch (error) {
      console.error("Error generating resume:", error)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: false,
          error: "Failed to generate resume",
        }),
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Resume Generator</h3>
      <p className="text-muted-foreground text-sm">
        Generate a professional resume based on our conversation.
      </p>

      {resumeUrl ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(resumeUrl, "_blank")}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Resume
        </Button>
      ) : (
        <Button
          onClick={handleGenerateResume}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Resume
            </>
          )}
        </Button>
      )}
    </div>
  )
}
