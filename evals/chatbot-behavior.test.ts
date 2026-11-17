import assert from "node:assert/strict"
import { test } from "node:test"

import type { UIMessage } from "ai"

import { parseAIModel } from "../config/ai"
import { getChatActivityLabel } from "../lib/chatbot-activity"
import { trimChatHistory } from "../lib/chatbot-history"
import { searchKnowledgeDocuments } from "../lib/chatbot-search"

test("parses a provider without losing a namespaced model ID", () => {
  assert.deepEqual(parseAIModel("groq:openai/gpt-oss-120b"), {
    id: "groq:openai/gpt-oss-120b",
    provider: "groq",
    modelName: "openai/gpt-oss-120b",
  })
  for (const invalid of [
    "haiku",
    "other:model",
    "groq:",
    "groq: model",
    "groq:a:b",
  ]) {
    assert.throws(() => parseAIModel(invalid))
  }
})

test("retrieves the matching technical passage instead of the start of the document", () => {
  const matches = searchKnowledgeDocuments(
    [
      {
        title: "Zero Locker",
        url: "https://example.com/locker",
        content: `${"Introductory text. ".repeat(200)}\n\nEncryption uses AES-256-GCM before database storage.`,
      },
      {
        title: "Other project",
        url: "https://example.com/other",
        content: "An unrelated music player.",
      },
    ],
    "Zero Locker encryption AES"
  )
  assert.ok(matches[0].excerpt.includes("AES-256-GCM"))
  assert.equal(matches[0].url, "https://example.com/locker")
  assert.ok(matches.every((match) => match.excerpt.length <= 1600))
})

test("does not return unrelated sources when nothing matches", () => {
  assert.deepEqual(
    searchKnowledgeDocuments(
      [
        {
          title: "Music player",
          url: "https://example.com/music",
          content: "Local audio files",
        },
      ],
      "encryption banking"
    ),
    []
  )
})

test("bounds results and removes MDX author notes from returned excerpts", () => {
  const matches = searchKnowledgeDocuments(
    Array.from({ length: 6 }, (_, index) => ({
      title: `Project ${index}`,
      url: `https://example.com/${index}`,
      content: "{/* secret author note */}\n\nPublished encryption details.",
    })),
    "encryption"
  )
  assert.equal(matches.length, 4)
  assert.ok(matches.every((match) => !match.excerpt.includes("author note")))
})

test("drops old retrieval payloads on the wire without changing visible history", () => {
  const messages: UIMessage[] = [
    {
      id: "u",
      role: "user",
      parts: [{ type: "text", text: "Explain Jobflow" }],
    },
    {
      id: "a",
      role: "assistant",
      parts: [
        {
          type: "tool-searchPortfolio",
          toolCallId: "lookup",
          state: "output-available",
          input: { query: "Jobflow", topics: ["work"] },
          output: { matches: [{ excerpt: "x".repeat(6400) }] },
        },
        { type: "text", text: "I build recruiting automation." },
      ],
    },
  ]
  const result = trimChatHistory(messages)
  assert.ok(JSON.stringify(result).length < 1000)
  assert.ok(JSON.stringify(messages).includes("x".repeat(6400)))
  assert.deepEqual(result[1].parts[1], messages[1].parts[1])
})

test("suppresses duplicate footer activity while a real lookup is running", () => {
  const messages: UIMessage[] = [
    {
      id: "a",
      role: "assistant",
      parts: [
        {
          type: "tool-searchPortfolio",
          toolCallId: "lookup",
          state: "input-available",
          input: { query: "Jobflow", topics: ["work"] },
        },
      ],
    },
  ]
  assert.equal(getChatActivityLabel(messages, "streaming", false), null)
  assert.equal(
    getChatActivityLabel(messages, "streaming", true),
    "Stopping the reply…"
  )
  assert.equal(getChatActivityLabel(messages, "ready", false), null)
})

test("reports preparing then writing based on actual streamed text", () => {
  const messages: UIMessage[] = [
    { id: "u", role: "user", parts: [{ type: "text", text: "hey" }] },
  ]
  assert.equal(
    getChatActivityLabel(messages, "submitted", false),
    "Preparing a reply…"
  )
  messages.push({
    id: "a",
    role: "assistant",
    parts: [{ type: "text", text: "Hey!" }],
  })
  assert.equal(
    getChatActivityLabel(messages, "streaming", false),
    "Writing a reply…"
  )
})
