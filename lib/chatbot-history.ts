import type { UIMessage } from "ai"

export function trimChatHistory(messages: UIMessage[]): UIMessage[] {
  const recent = messages
    .filter((message) => message.role !== "system")
    .slice(-12)
  const firstUser = recent.findIndex((message) => message.role === "user")
  return recent.slice(Math.max(0, firstUser)).map((message) => ({
    ...message,
    parts: message.parts.map((part) => {
      if (
        part.type === "tool-searchPortfolio" &&
        "state" in part &&
        part.state === "output-available"
      ) {
        return {
          ...part,
          output: {
            note: "Earlier search excerpts omitted to save tokens. Search again if these details are needed; the previous answer is in the conversation.",
          },
        }
      }
      return part
    }),
  }))
}
