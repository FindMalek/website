import { z } from "zod"

export const MAX_MATCH_INPUT_CHARS = 8000

const requirement = z.string().max(160)

export const matchModelSchema = z.object({
  isJobPost: z.boolean(),
  role: z.string().max(120),
  summary: z.string().max(400),
  matches: z
    .array(
      z.object({
        requirement,
        claim: z.string().max(300),
        evidence: z.array(z.string()).max(3),
      })
    )
    .max(5),
  partials: z
    .array(
      z.object({
        requirement,
        have: z.string().max(240),
        missing: z.string().max(240),
        evidence: z.array(z.string()).max(2),
      })
    )
    .max(4),
  gaps: z.array(z.object({ requirement, note: z.string().max(200) })).max(6),
})

const proofSchema = z.object({ label: z.string(), href: z.string() })

export const journeyMatchSchema = z.object({
  role: z.string(),
  summary: z.string(),
  matches: z.array(
    z.object({
      requirement: z.string(),
      claim: z.string(),
      proof: z.array(proofSchema),
    })
  ),
  partials: z.array(
    z.object({
      requirement: z.string(),
      have: z.string(),
      missing: z.string(),
      proof: z.array(proofSchema),
    })
  ),
  gaps: z.array(z.object({ requirement: z.string(), note: z.string() })),
})

export const MATCH_ERROR_CODES = [
  "not-a-job-post",
  "unreadable-page",
  "too-long",
  "empty",
  "rate-limited",
  "model-unavailable",
] as const

export const matchResponseSchema = z.union([
  z.object({ match: journeyMatchSchema }),
  z.object({ error: z.enum(MATCH_ERROR_CODES) }),
])

export type MatchProof = z.infer<typeof proofSchema>
export type JourneyMatch = z.infer<typeof journeyMatchSchema>
export type MatchErrorCode = (typeof MATCH_ERROR_CODES)[number]
