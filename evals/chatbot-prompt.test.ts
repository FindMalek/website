import assert from "node:assert/strict"
import { test } from "node:test"

import { createAnthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

import { buildChatPrompt } from "../lib/chatbot-prompt"

test("streams with cached instructions and page context without system messages in history", async () => {
  const requests: Array<Record<string, unknown>> = []
  const anthropic = createAnthropic({
    apiKey: "test-key",
    fetch: async (_input, init) => {
      requests.push(JSON.parse(String(init?.body)))
      const events = [
        {
          type: "message_start",
          message: {
            id: "test",
            type: "message",
            role: "assistant",
            model: "claude-haiku-5-5",
            content: [],
            stop_reason: null,
            stop_sequence: null,
            usage: { input_tokens: 10, output_tokens: 0 },
          },
        },
        {
          type: "content_block_start",
          index: 0,
          content_block: { type: "text", text: "" },
        },
        {
          type: "content_block_delta",
          index: 0,
          delta: { type: "text_delta", text: "Hey there!" },
        },
        { type: "content_block_stop", index: 0 },
        {
          type: "message_delta",
          delta: { stop_reason: "end_turn", stop_sequence: null },
          usage: { output_tokens: 4 },
        },
        { type: "message_stop" },
      ]
      return new Response(
        events
          .map(
            (event) =>
              `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`
          )
          .join(""),
        {
          headers: { "Content-Type": "text/event-stream" },
        }
      )
    },
  })

  const result = streamText({
    model: anthropic("claude-haiku-5-5"),
    ...buildChatPrompt(
      "Answer using Malek's portfolio.",
      "The visitor is reading Zero Locker.",
      "anthropic",
      [{ role: "user", content: "hey" }]
    ),
    maxOutputTokens: 100,
    maxRetries: 0,
  })

  assert.equal(await result.text, "Hey there!")
  assert.equal(requests.length, 1)
  assert.deepEqual(requests[0].system, [
    {
      type: "text",
      text: "Answer using Malek's portfolio.",
      cache_control: { type: "ephemeral" },
    },
    { type: "text", text: "The visitor is reading Zero Locker." },
  ])
  assert.deepEqual(requests[0].messages, [
    { role: "user", content: [{ type: "text", text: "hey" }] },
  ])
})
