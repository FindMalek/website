import { safeValidateUIMessages, type UIMessage } from "ai"
import { z } from "zod/v3"

import { trimChatHistory } from "@/lib/chatbot-history"

const requestSchema = z.object({
  messages: z.array(z.unknown()).min(1).max(100),
  pageContext: z
    .object({
      route: z.string().startsWith("/").max(200),
      slug: z.string().max(120).optional(),
      section: z
        .enum(["work", "education", "projects", "stack", "about"])
        .nullable()
        .default(null),
    })
    .optional(),
})

export async function parseChatRequest(req: Request) {
  const body = await req.text()
  if (new TextEncoder().encode(body).length > 48_000) {
    throw new Error("Please send a shorter message.")
  }

  const parsed = requestSchema.parse(JSON.parse(body))
  const validated = await safeValidateUIMessages({ messages: parsed.messages })
  if (!validated.success) throw new Error("Invalid chat messages.")

  const history = validated.data.filter((message) => message.role !== "system")
  const latest = history.at(-1)
  if (!latest || latest.role !== "user") {
    throw new Error("Please send a message first.")
  }
  if (
    latest.parts.some((part) => part.type !== "text") ||
    !latest.parts.some((part) => part.type === "text" && part.text.trim())
  ) {
    throw new Error("This chat accepts text messages only.")
  }

  const recent: UIMessage[] = trimChatHistory(history).map((message) => ({
    ...message,
    parts: message.parts.filter(
      (part) => part.type === "text" || part.type.startsWith("tool-")
    ),
  }))
  if (
    recent.some(
      (message) =>
        message.role === "user" &&
        message.parts
          .filter((part) => part.type === "text")
          .reduce((length, part) => length + part.text.length, 0) > 2000
    )
  ) {
    throw new Error("Please keep each message under 2,000 characters.")
  }

  const firstUser = recent.findIndex((message) => message.role === "user")
  return { messages: recent.slice(firstUser), pageContext: parsed.pageContext }
}
