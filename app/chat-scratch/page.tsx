// TEMPORARY: scratch route to verify the AI SDK v4->v7 migration end-to-end
// before the docked/floating chat UI (Phase 2b) replaces ContactChatBot.
// Deleted once Phase 2b lands.
import { ContactChatBot } from "@/components/app/contact-chat-bot"

export default function ChatScratchPage() {
  return (
    <div className="w-full px-4 py-20">
      <ContactChatBot />
    </div>
  )
}
