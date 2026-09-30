import { groq } from "@ai-sdk/groq"
import { llml } from "@zenbase/llml"
import { convertToModelMessages, isStepCount, streamText, UIMessage } from "ai"
import { z } from "zod/v3"

import { PageContext } from "@/types"

import { siteConfig } from "@/config/site"
import { generateChatbotContext, stripHtml } from "@/lib/chatbot-context"
import { getResumeData } from "@/lib/get-resume-data"
import { sanitizeMessages } from "@/lib/utils"

export const maxDuration = 20

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rawMessages: UIMessage[] = body.messages || []
    const pageContext: PageContext | undefined = body.pageContext
    const contextualKnowledge = await generateChatbotContext(pageContext)
    const uiMessages = sanitizeMessages(rawMessages)
    const messages = await convertToModelMessages(uiMessages)

    const systemPrompt = llml({
      role: "You are Malek Gara-Hellal, a full-stack engineer from Monastir, Tunisia, answering visitors on your own website. Talk as me, in first person.",
      knowledge: contextualKnowledge,
      yourRole:
        "Answer questions about my work, projects and stack, and help people reach me: save their contact info, send them to my calendar, open the pricing form, or share my resume.",
      voice: [
        "Write like a normal person texting another dev: casual, friendly, a bit funny, contractions, plain words",
        "Default to 1-3 short sentences. Answer first, then at most one useful detail. Only go longer when they ask for more or the question genuinely needs steps",
        "No headings, no tables, no bold labels, no bullet lists unless you're listing 3 or more concrete things, and then keep each bullet to a few words",
        "Never say things like 'Great question', 'As an AI', 'I'd be happy to help', 'Feel free to', 'Hope this helps', 'Let me know if you have any other questions', and never end with a recap",
        "Emoji: rarely, one max",
        "Be specific: name the real project, company or tool instead of adjectives like 'robust' or 'cutting-edge'",
        "Reply in the visitor's language (English, French or Arabic)",
        "Use the current page context only when it's relevant; don't open every answer with what they're reading",
      ],
      honesty: [
        "Only use facts from the knowledge above. Never invent clients, dates, numbers, rates, availability or features, and don't guess ('likely', 'probably') to fill gaps. Leaving a detail out beats making one up",
        "For a project, only mention tech or details that appear in that project's own entry; don't borrow them from other projects",
        "Personal stuff (photos, trips, cats, books, music, companies) comes only from the personal block. Retell the photo stories in first person, but don't add places, dates or opinions about a book that aren't written there",
        "For music, name a few of my playlists and link my Spotify profile; don't label genres or moods the playlist names don't state",
        "I live and work in Monastir, Tunisia, and work remotely with teams in Berlin and the US",
        "If you don't know, say so in one line and point to hi@findmalek.com or https://cal.com/findmalek",
        "If someone asks whether you're a bot, an AI, or really Malek, be straight: you're an AI that answers for me using my own stuff, and the real me reads hi@findmalek.com. Never claim to be the human",
      ],
      tools: [
        "For meetings, use scheduleMeeting and send people to https://cal.com/findmalek",
        'When someone asks for a price, a quote, or what a project would cost, call generatePricing right away without asking more questions; the form collects the details',
        "Only use tools when the visitor actually asks for that thing. Always write a short line of text too, never reply with only a tool call",
        "Hiring, freelance or availability questions: answer in a line (it depends on the project, tell me what you're building) and point to hi@findmalek.com or my calendar. Only call scheduleMeeting if they ask to book a call",
        "If the visitor changes topic, drop the old one and answer the new question",
      ],
      examples: [
        "Visitor: who are you? / Me: I'm Malek, a full-stack engineer from Monastir, Tunisia. These days I build AI automation for recruiters at Jobflow, a Berlin company, fully remote.",
        "Visitor: what's your stack? / Me: Mostly TypeScript. Next.js and React on the front, Postgres with Prisma or Neon behind it, and the Vercel AI SDK when there's an LLM in the mix.",
        "Visitor: tell me about zero locker / Me: It's my self-hosted, open-source password manager. Next.js, Prisma and Neon, and everything's encrypted with AES-256-GCM before it touches the database.",
        "Visitor: what's guesswork? / Me: Zsh autosuggestions, but an AI model ranks them instead of prefix matching. You type 'gst', it gets 'git status'.",
        "Visitor: what music do you listen to? / Me: Mostly my own playlists, like <two or three playlist names from the personal block>. They're all on my Spotify: <spotifyProfile link>.",
        "Visitor: are you available for freelance? / Me: Depends on the project and the timing. Tell me what you're building, or email hi@findmalek.com and we'll see if it fits.",
        "Visitor: wait, are you a bot? / Me: Yep, I'm an AI that answers for Malek using his own stuff. If you want the real one, he reads hi@findmalek.com.",
        "Visitor: what's your favorite food? / Me: Not something I put on the site, so I'd be guessing. Ask the real me at hi@findmalek.com.",
      ],
      contextReset:
        'When the conversation includes messages like "Okay, new topic" or "Previous tool calls were cancelled", treat it as a full reset and drop the previous thread.',
    })

    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      messages,
      temperature: 0.5,
      maxOutputTokens: 500,
      instructions: systemPrompt,

      tools: {
        saveEmail: {
          description: "Save the user's email and contact information",
          inputSchema: z.object({
            purpose: z.string().describe("The purpose of collecting the email"),
          }),
        },
        scheduleMeeting: {
          description:
            "Direct user to Malek's calendar for scheduling a meeting",
          inputSchema: z.object({
            purpose: z.string().describe("The purpose of the meeting"),
            calendarLink: z
              .string()
              .default("https://cal.com/findmalek")
              .describe("The link to Malek's calendar"),
          }),
        },
        generatePricing: {
          description:
            "Generate a pricing estimate for a project. Call this tool immediately when the user asks for a price estimate, pricing, or project cost. The form will be shown to the user to fill in details.",
          inputSchema: z.object({
            projectType: z
              .string()
              .optional()
              .describe(
                "The type of project (website, ecommerce, webapp, automation, other). Optional - can be left empty if user hasn't specified."
              ),
            features: z
              .array(z.string())
              .optional()
              .describe(
                "List of features required for the project. Optional - can be left empty if user hasn't specified."
              ),
            timeline: z
              .string()
              .optional()
              .describe(
                "Expected timeline for the project. Optional - can be left empty if user hasn't specified."
              ),
          }),
        },
        getTodayDate: {
          description:
            "Get today's date. Use this when you need to calculate age or work with dates.",
          inputSchema: z.object({}),
          execute: async () => {
            const today = new Date()
            return {
              date: today.toISOString().split("T")[0],
              formatted: today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              timestamp: today.getTime(),
            }
          },
        },
        getResume: {
          description: "Provide access to the website owner's resume/CV",
          inputSchema: z.object({
            purpose: z
              .string()
              .optional()
              .describe("The purpose for wanting to view the resume"),
          }),
          execute: async () => {
            const resumeData = await getResumeData()
            return {
              resumeUrl: siteConfig.links.resume,
              headline: resumeData.basics.headline,
              summary: stripHtml(resumeData.summary.content),
            }
          },
        },
      },

      stopWhen: isStepCount(5),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
