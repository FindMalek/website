import type { Persona } from "./types"

export const PERSONAS: Persona[] = [
  {
    id: "recruiter",
    label: "Recruiter",
    hint: "Location, seniority, availability, CV",
    cardIds: [
      "r-where",
      "r-mode",
      "r-roles",
      "r-seniority",
      "r-availability",
      "r-cv",
    ],
  },
  {
    id: "hiring-manager",
    label: "Hiring manager",
    hint: "LLMs in production, evals, wins, teamwork",
    cardIds: ["h-llm", "h-evals", "h-win", "h-bug", "h-team", "h-90"],
  },
  {
    id: "founder",
    label: "Founder",
    hint: "What I ship alone, what I ran, how I decide",
    cardIds: ["f-alone", "f-built", "f-scope"],
  },
  {
    id: "engineer",
    label: "Fellow engineer",
    hint: "This site, the stack, open source, writing",
    cardIds: ["e-site", "e-stack", "e-oss", "e-writing"],
  },
  {
    id: "explore",
    label: "Just show me around",
    hint: "Five cards, the short version",
    cardIds: ["x-who", "h-llm", "h-win", "f-built", "e-site"],
  },
]

export const PERSONA_BY_ID = new Map(
  PERSONAS.map((persona) => [persona.id, persona])
)
