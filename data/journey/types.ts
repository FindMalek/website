export type PersonaId =
  | "recruiter"
  | "hiring-manager"
  | "founder"
  | "engineer"
  | "explore"

export type ProofKind = "case-study" | "code" | "post" | "source" | "contact"

export type ProofChip = {
  label: string
  href: string
  kind: ProofKind
}

export type JourneyCard = {
  id: string
  question: string
  answer: string[]
  proof: ProofChip[]
}

export type Persona = {
  id: PersonaId
  label: string
  hint: string
  cardIds: string[]
}
