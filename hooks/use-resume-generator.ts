import { useState } from "react"

import { siteConfig } from "@/config/site"
import { createToolResult, type ToolCallLike } from "@/lib/tool-helpers"
import { getGlobalChatContext } from "@/hooks/use-chat-with-tools"

interface ResumeGeneratorState {
  isGenerating: boolean
  resumeUrl: string | null
}

export function useResumeGenerator(toolCall: ToolCallLike) {
  const [state, setState] = useState<ResumeGeneratorState>({
    isGenerating: false,
    resumeUrl: null,
  })

  const { addToolResult } = getGlobalChatContext()

  const updateState = <K extends keyof ResumeGeneratorState>(
    key: K,
    value: ResumeGeneratorState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const generateResume = async () => {
    updateState("isGenerating", true)

    try {
      const resumeUrl = siteConfig.links.resume
      updateState("resumeUrl", resumeUrl)

      const result = createToolResult(true, {
        resumeUrl,
        message: "Resume link provided successfully",
      })

      addToolResult({
        toolCallId: toolCall.toolCallId,
        tool: "getResume",
        result,
      })
    } catch (error) {
      console.error("Error providing resume:", error)

      addToolResult({
        toolCallId: toolCall.toolCallId,
        tool: "getResume",
        result: createToolResult(false, {
          error: "Failed to provide resume link",
        }),
      })
    } finally {
      updateState("isGenerating", false)
    }
  }

  return {
    state,
    updateState,
    generateResume,
  }
}
