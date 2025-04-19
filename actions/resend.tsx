"use server"

import { Resend } from "resend"

import { env } from "@/env"
import { ConversationHistory } from "@/types"

import { siteConfig } from "@/config/site"

import ContactEmailIntroduction from "@/components/app/contact-email-introduction"

const resend = new Resend(env.RESEND_API_KEY)

export async function sendContactEmailIntroduction(
  email: string,
  name: string,
  contactPurpose: string,
  conversation: ConversationHistory[]
) {
  try {
    await resend.emails.send({
      from: "Malek Gara-Hellal <no-reply@findmalek.com>",
      to: [email, siteConfig.author.email],
      subject: `We received your email, ${name}`,
      react: (
        <ContactEmailIntroduction
          userName={name}
          userEmail={email}
          contactPurpose={contactPurpose}
          conversation={conversation}
        />
      ),
    })

    return {
      userEmailSent: true,
      ownerEmailSent: true,
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      userEmailSent: false,
      ownerEmailSent: false,
    }
  }
}
