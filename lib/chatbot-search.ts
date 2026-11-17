export interface KnowledgeDocument {
  title: string
  url: string
  content: string
  keywords?: string[]
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "about",
  "do",
  "does",
  "for",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "with",
  "you",
  "your",
  "tell",
  "malek",
  "le",
  "la",
  "les",
  "de",
  "des",
  "du",
  "et",
  "un",
  "une",
  "tu",
  "vous",
  "est",
  "ما",
  "في",
  "عن",
  "من",
])

function words(text: string): string[] {
  return (
    text
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu) ?? []
  )
}

function chunks(markdown: string): string[] {
  const clean = markdown.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").trim()
  const result: string[] = []
  let current = ""
  for (const paragraph of clean.split(/\n\s*\n/)) {
    if (current && current.length + paragraph.length + 2 > 1600) {
      result.push(current)
      current = ""
    }
    for (let offset = 0; offset < paragraph.length; offset += 1600) {
      const section = paragraph.slice(offset, offset + 1600)
      if (section.length === 1600) result.push(section)
      else current += `${current ? "\n\n" : ""}${section}`
    }
  }
  if (current) result.push(current)
  return result
}

export function searchKnowledgeDocuments(
  documents: KnowledgeDocument[],
  query: string
) {
  const terms = [
    ...new Set(words(query).filter((term) => !STOP_WORDS.has(term))),
  ]
  if (terms.length === 0) return []

  return documents
    .flatMap((document) => {
      const title = new Set(words(document.title))
      const keywords = new Set(words((document.keywords ?? []).join(" ")))
      return chunks(document.content).map((excerpt, index) => {
        const body = new Set(words(excerpt))
        const score = terms.reduce(
          (total, term) =>
            total +
            (title.has(term) ? 6 : 0) +
            (keywords.has(term) ? 2 : 0) +
            (body.has(term) ? 3 : 0),
          0
        )
        return {
          title: document.title,
          url: document.url,
          excerpt,
          score,
          index,
        }
      })
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 4)
    .map(({ title, url, excerpt }) => ({ title, url, excerpt }))
}
