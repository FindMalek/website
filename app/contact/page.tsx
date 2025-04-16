import type { Metadata } from "next"

import { ContactChatBot } from "@/components/app/contact-chat-bot"
import { PageHeading } from "@/components/shared/page-heading"

export const metadata: Metadata = {
  title: "Contact",
}

export default function Contact() {
  return (
    <div className="w-full px-4 pt-20">
      <PageHeading heading="Something on your mind? Get in touch!" />
      <ContactChatBot />
    </div>
  )
}
