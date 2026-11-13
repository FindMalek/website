// Run: node scripts/check-journey.mjs (BASE_URL defaults to http://localhost:3000)
import { JOURNEY_CARDS } from "../data/journey/cards.ts"
import { CAL_URL, CONTACT_EMAIL, SITE_URL } from "../data/journey/contact.ts"
import { PERSONAS } from "../data/journey/personas.ts"

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000"

const BANNED = [
  /[–—]/,
  /400\+/,
  /5th of 38/i,
  /#1286/,
  /y combinator/i,
  /valedictorian/i,
  /2 min(ute)?s? to 8/i,
  /10 s to 3 s/i,
  /\b(leverage|robust|seamless|crafted)\b/i,
  /\bEffect\b/,
]

const REQUIRED_FACTS = {
  "r-where": ["Monastir", "Africa/Tunis", "relocation"],
  "r-seniority": ["5+ years", "September 2024"],
  "r-availability": ["calendar"],
  "h-llm": ["interview analyzer", "task extractor", "feature flag"],
  "h-evals": ["Braintrust", "LLM judge"],
  "h-win": ["PostGIS", "GIST", "90 seconds", "100 milliseconds", "16,000"],
  "h-team": ["332", "315", "47"],
  "f-built": ["Undrstnd Labs", "Endless Byte", "200+"],
  "e-oss": ["Databuddy", "122", "87", "85", "7,000+", "3,057"],
}

const failures = []
const fail = (message) => failures.push(message)

for (const persona of PERSONAS) {
  for (const id of persona.cardIds) {
    if (!JOURNEY_CARDS.some((card) => card.id === id)) {
      fail(`persona ${persona.id} references missing card ${id}`)
    }
  }
}

for (const card of JOURNEY_CARDS) {
  const text = [
    card.question,
    ...card.answer,
    ...card.proof.map((p) => p.label),
  ].join("\n")
  for (const pattern of BANNED) {
    if (pattern.test(text)) fail(`${card.id}: banned pattern ${pattern}`)
  }
  if (card.answer.length < 2 || card.answer.length > 5) {
    fail(`${card.id}: ${card.answer.length} lines`)
  }
  if (card.proof.length === 0) fail(`${card.id}: no proof chips`)
  for (const fact of REQUIRED_FACTS[card.id] ?? []) {
    if (!text.includes(fact)) fail(`${card.id}: missing fact "${fact}"`)
  }
}

const hrefs = new Map()
for (const card of JOURNEY_CARDS) {
  for (const chip of card.proof) hrefs.set(chip.href, card.id)
}
hrefs.set(CAL_URL, "closing")
hrefs.set(`${SITE_URL}/cv.pdf`, "closing")
hrefs.set("/cv.pdf?download=1", "closing")

async function check([href, owner]) {
  if (href.startsWith("mailto:")) {
    if (href !== `mailto:${CONTACT_EMAIL}`) fail(`${owner}: odd mailto ${href}`)
    return
  }
  const url = href.startsWith("/") ? `${BASE_URL}${href.split("#")[0]}` : href
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 findmalek-link-check" },
      signal: AbortSignal.timeout(30000),
    })
    await res.body?.cancel()
    if (res.status !== 200) fail(`${owner}: ${href} returned ${res.status}`)
  } catch (error) {
    fail(`${owner}: ${href} failed (${error.message})`)
  }
}

const queue = [...hrefs.entries()]
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let item = queue.pop(); item; item = queue.pop()) await check(item)
  })
)

console.log(
  `${JOURNEY_CARDS.length} cards, ${PERSONAS.length} personas, ${hrefs.size} links checked`
)
if (failures.length > 0) {
  console.error(failures.join("\n"))
  process.exit(1)
}
console.log("ok")
