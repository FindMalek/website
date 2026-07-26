"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { usePathname } from "next/navigation"

import { PageContext } from "@/types"

import { useActiveSection } from "@/hooks/use-active-section"
import {
  setGlobalChatContext,
  useChatWithTools,
} from "@/hooks/use-chat-with-tools"

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
  const pathname = usePathname()
  const activeSection = useActiveSection(["work", "projects", "stack", "about"])

  const pageContext = useMemo<PageContext>(() => {
    const slugMatch = pathname.match(/^\/(?:work|projects)\/(.+)$/)
    return {
      route: pathname,
      section: activeSection,
      slug: slugMatch?.[1],
    }
  }, [pathname, activeSection])

  const chat = useChatWithTools(pageContext)
  const [dockState, setDockState] = useState<DockState>("idle")
  const previousMessageCount = useRef(chat.messages.length)

  useEffect(() => {
    setGlobalChatContext(chat)
  }, [chat])

  // Dock whenever a genuinely new message gets added (length increases) --
  // not just the first time. Reacting to an *increase* rather than to
  // "count > 1 and currently idle" means this only ever fires from an actual
  // send, never from closeChat() itself (which doesn't touch messages.length),
  // so closing the chat sticks -- but sending again after closing correctly
  // reopens it, with the full existing history intact since messages state
  // lives in the one shared chat instance and is never cleared on close.
  useEffect(() => {
    if (chat.messages.length > previousMessageCount.current) {
      setDockState("docked")
    }
    previousMessageCount.current = chat.messages.length
  }, [chat.messages.length])

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
