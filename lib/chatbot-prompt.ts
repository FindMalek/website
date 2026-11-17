import type { ModelMessage, SystemModelMessage } from "ai"

import type { AIProvider } from "@/config/ai"

export function buildChatPrompt(
  systemPrompt: string,
  pageInstructions: string | undefined,
  provider: AIProvider,
  messages: ModelMessage[]
) {
  const instructions: SystemModelMessage[] = [
    {
      role: "system",
      content: systemPrompt,
      ...(provider === "anthropic"
        ? {
            providerOptions: {
              anthropic: { cacheControl: { type: "ephemeral" } },
            },
          }
        : {}),
    },
    ...(pageInstructions
      ? [{ role: "system" as const, content: pageInstructions }]
      : []),
  ]

  return { instructions, messages }
}
