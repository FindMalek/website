import { z } from "zod/v3"

export const DEFAULT_AI_MODEL = "anthropic:claude-haiku-5-5"
export const AI_PROVIDER_KEYS = {
  anthropic: "ANTHROPIC_API_KEY",
  groq: "GROQ_API_KEY",
  openai: "OPENAI_API_KEY",
} as const

export type AIProvider = keyof typeof AI_PROVIDER_KEYS

export const aiModelSchema = z
  .string()
  .regex(/^[a-z][a-z0-9-]*:[^\s:]+$/, "Use provider:model_name")
  .refine(
    (value) => Object.hasOwn(AI_PROVIDER_KEYS, value.split(":")[0]),
    "Register this provider in config/ai.ts and lib/ai-model.ts first"
  )
  .default(DEFAULT_AI_MODEL)

export function parseAIModel(value: string) {
  const id = aiModelSchema.parse(value)
  const separator = id.indexOf(":")
  return {
    id: id as `${AIProvider}:${string}`,
    provider: id.slice(0, separator) as AIProvider,
    modelName: id.slice(separator + 1),
  }
}
