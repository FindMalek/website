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
  const hasAutoDocked = useRef(false)

  useEffect(() => {
    setGlobalChatContext(chat)
  }, [chat])

  // Dock the moment the visitor sends a real message (index 0 is the seeded
  // welcome message, so >1 means a real exchange has started). Guarded by a
  // ref rather than depending on `dockState` -- messages.length stays >1
  // forever once a conversation has started, so a dockState-dependent check
  // would re-dock immediately every time the visitor closes the chat,
  // making it impossible to ever close after the first exchange.
  useEffect(() => {
    if (chat.messages.length > 1 && !hasAutoDocked.current) {
      hasAutoDocked.current = true
      setDockState("docked")
    }
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
