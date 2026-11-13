import {
  CAL_URL,
  CONTACT_EMAIL,
  JOURNEY_CARD_BY_ID,
  SITE_URL,
} from "@/data/journey"

import type { JourneyMatch } from "./match-schema"

export function matchSummaryText(match: JourneyMatch): string {
  const list = (items: { requirement: string }[]) =>
    items.map((item) => item.requirement).join("; ")

  return [
    `Role: ${match.role}.`,
    match.summary,
    match.matches.length > 0 && `Strong matches: ${list(match.matches)}.`,
    match.partials.length > 0 && `Partial: ${list(match.partials)}.`,
    match.gaps.length > 0 && `Gaps: ${list(match.gaps)}.`,
  ]
    .filter(Boolean)
    .join(" ")
}

function absolute(href: string): string {
  return href.startsWith("/") ? `${SITE_URL}${href}` : href
}

export function buildNotesSummary(
  openedCardIds: string[],
  match: JourneyMatch | null
): string {
  const lines = [
    "Malek Gara-Hellal, senior full-stack engineer (AI systems, LLM pipelines, evals).",
    "Based in Monastir, Tunisia. Works remotely, open to relocation.",
    `CV: ${SITE_URL}/cv.pdf`,
    `Book a call: ${CAL_URL}`,
    `Email: ${CONTACT_EMAIL}`,
  ]

  if (match) {
    lines.push("", `Role match: ${match.role}`, match.summary)
    for (const item of match.matches) {
      lines.push(
        `+ ${item.requirement}: ${item.claim} (${item.proof.map((p) => absolute(p.href)).join(", ")})`
      )
    }
    for (const item of match.partials) {
      lines.push(
        `~ ${item.requirement}: ${item.have} Missing: ${item.missing} (${item.proof.map((p) => absolute(p.href)).join(", ")})`
      )
    }
    for (const item of match.gaps) {
      lines.push(`- ${item.requirement}: ${item.note}`)
    }
  }

  const cards = openedCardIds.flatMap((id) => {
    const card = JOURNEY_CARD_BY_ID.get(id)
    return card ? [card] : []
  })
  if (cards.length > 0) {
    lines.push("", "Proof:")
    for (const card of cards) {
      lines.push(`${card.question}`)
      for (const chip of card.proof) {
        lines.push(`  ${chip.label}: ${absolute(chip.href)}`)
      }
    }
  }

  return lines.join("\n")
}
