// A tiny in-page event bus so decorative UI (the footer wordmark) can react
// to the chat without the chat knowing who is listening.

export type ChatActivity =
  | { type: "focus" }
  | { type: "blur" }
  | { type: "keystroke" }
  | { type: "submit" }
  | { type: "reply-start" }
  | { type: "reply-chunk" }
  | { type: "reply-end" }

type Listener = (activity: ChatActivity) => void

const listeners = new Set<Listener>()

export function emitChatActivity(activity: ChatActivity): void {
  for (const listener of listeners) listener(activity)
}

export function subscribeChatActivity(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
