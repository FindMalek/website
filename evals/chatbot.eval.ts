import { appendFileSync } from "node:fs"

import { Eval } from "braintrust"

import { CHAT_EVAL_CASES, type ChatEvalCase } from "./chatbot.dataset"

const BASE_URL = process.env.EVAL_BASE_URL ?? "http://localhost:3000"
const IDK = /^(i don'?t know|i'?m not sure|no idea)[.!\s]*$/i
const MAX_WORDS = 90

// the model likes typographic hyphens and narrow spaces, which would make
// "Endless Byte" or "full-time" miss a plain-text match
function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u00a0\u202f\u2009]/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .toLowerCase()
}

type ChatResult = { text: string; tools: string[] }

type ChatInput = Pick<ChatEvalCase, "pageContext"> & { question: string }

async function askChatbot({
  question,
  pageContext,
}: ChatInput): Promise<ChatResult> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pageContext,
      messages: [
        {
          id: "eval-1",
          role: "user",
          parts: [{ type: "text", text: question }],
        },
      ],
    }),
  })
  if (!res.ok) throw new Error(`chat api returned ${res.status}`)

  let text = ""
  const tools: string[] = []
  for (const line of (await res.text()).split("\n")) {
    if (!line.startsWith("data: ")) continue
    try {
      const chunk = JSON.parse(line.slice(6))
      if (chunk.type === "text-delta") text += chunk.delta ?? ""
      if (chunk.type === "tool-input-available") tools.push(chunk.toolName)
    } catch {
      // [DONE] and keep-alive lines
    }
  }
  const result = { text: text.trim(), tools }
  // EVAL_DUMP=/path/out.jsonl keeps every reply so failures can be read
  if (process.env.EVAL_DUMP) {
    appendFileSync(
      process.env.EVAL_DUMP,
      JSON.stringify({ question, ...result }) + "\n"
    )
  }
  return result
}

Eval("findmalek-chatbot", {
  data: () =>
    CHAT_EVAL_CASES.map((testCase) => ({
      input: { question: testCase.input, pageContext: testCase.pageContext },
      expected: testCase,
      metadata: { tag: testCase.tag },
    })),
  task: askChatbot,
  scores: [
    ({ output, expected }: { output: ChatResult; expected?: ChatEvalCase }) => {
      const reply = normalize(output.text)
      const must = (expected?.include ?? []).every((fact) =>
        reply.includes(normalize(fact))
      )
      const any =
        !expected?.includeAny ||
        expected.includeAny.some((fact) => reply.includes(normalize(fact)))
      return { name: "has_expected_facts", score: must && any ? 1 : 0 }
    },
    ({ output, expected }: { output: ChatResult; expected?: ChatEvalCase }) => {
      const reply = normalize(output.text)
      const clean = !(expected?.exclude ?? []).some((fact) =>
        reply.includes(normalize(fact))
      )
      return { name: "avoids_forbidden", score: clean ? 1 : 0 }
    },
    ({
      output,
      expected,
    }: {
      output: ChatResult
      expected?: ChatEvalCase
    }) => ({
      name: "calls_expected_tool",
      score: !expected?.tool || output.tools.includes(expected.tool) ? 1 : 0,
    }),
    ({ output }: { output: ChatResult }) => ({
      name: "text_with_tool_call",
      score: output.tools.length === 0 || output.text.length > 0 ? 1 : 0,
    }),
    ({ output }: { output: ChatResult }) => ({
      name: "no_bare_idk",
      score: IDK.test(output.text) || output.text === "" ? 0 : 1,
    }),
    ({ output }: { output: ChatResult }) => ({
      name: "short_enough",
      score: output.text.split(/\s+/).length <= MAX_WORDS ? 1 : 0,
    }),
  ],
})
