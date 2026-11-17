import { anthropic } from "@ai-sdk/anthropic"
import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { createProviderRegistry } from "ai"

import { AI_PROVIDER_KEYS, DEFAULT_AI_MODEL, parseAIModel } from "@/config/ai"

const registry = createProviderRegistry({ anthropic, groq, openai })

export function getChatModel() {
  const selected = parseAIModel(process.env.AI_MODEL ?? DEFAULT_AI_MODEL)
  if (!process.env[AI_PROVIDER_KEYS[selected.provider]]) {
    throw new Error(`Missing ${AI_PROVIDER_KEYS[selected.provider]}`)
  }

  return { ...selected, model: registry.languageModel(selected.id) }
}
