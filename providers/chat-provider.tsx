"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import { setGlobalChatContext, useChatWithTools } from "@/hooks/use-chat-with-tools"

type DockState = "idle" | "docked"

interface ChatDockContextValue {
  chat: ReturnType<typeof useChatWithTools>
  dockState: DockState
  openChat: () => void
  closeChat: () => void
  /** Pre-fills the input as a draft without sending it. */
  seedInput: (text: string) => void
}

const ChatDockContext = createContext<ChatDockContextValue | null>(null)

export function useChatDock() {
  const ctx = useContext(ChatDockContext)
  if (!ctx) {
    throw new Error("useChatDock must be used within a ChatProvider")
  }
  return ctx
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const chat = useChatWithTools()
  const [dockState, setDockState] = useState<DockState>("idle")

  useEffect(() => {
    setGlobalChatContext(chat)
  }, [chat])

  // Dock the moment the visitor sends a real message (index 0 is the seeded
  // welcome message, so >1 means a real exchange has started).
  useEffect(() => {
    if (chat.messages.length > 1 && dockState === "idle") {
      setDockState("docked")
    }
  }, [chat.messages.length, dockState])

  const openChat = useCallback(() => setDockState("docked"), [])
  const closeChat = useCallback(() => setDockState("idle"), [])

  const seedInput = useCallback(
    (text: string) => {
      chat.handleInputChange({
        target: { value: text },
      } as React.ChangeEvent<HTMLTextAreaElement>)
      setDockState("docked")
    },
    [chat]
  )

  return (
    <ChatDockContext.Provider
      value={{ chat, dockState, openChat, closeChat, seedInput }}
    >
      {children}
    </ChatDockContext.Provider>
  )
}
