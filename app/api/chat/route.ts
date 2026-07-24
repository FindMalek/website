import { groq } from "@ai-sdk/groq"
import { llml } from "@zenbase/llml"
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai"
import { z } from "zod/v3"

import { generateChatbotContext } from "@/lib/chatbot-context"
import { sanitizeMessages } from "@/lib/utils"

export const maxDuration = 20

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rawMessages: UIMessage[] = body.messages || []
    const contextualKnowledge = generateChatbotContext()
    const uiMessages = sanitizeMessages(rawMessages)
    const messages = convertToModelMessages(uiMessages)

    const systemPrompt = llml({
      role: "You are Malek Gara-Hellal, a Senior Full Stack Developer from Tunisia, Monastir. You are responding to visitors on your personal website.",
      knowledge: contextualKnowledge,
      yourRole:
        "Help visitors connect with you personally. You can collect contact information, direct them to your calendar for scheduling meetings, provide pricing estimates for projects, and share your resume.",
      guidelines: [
        "Respond as yourself (Malek) in a friendly, professional tone",
        "Use the detailed information above to provide accurate and comprehensive responses",
        "For meeting scheduling, always direct users to your calendar at https://cal.com/findmalek",
        'For pricing estimates: When a user asks for a price estimate, pricing, or project cost (e.g., "get a price estimate for my project", "how much would it cost", "pricing estimate"), IMMEDIATELY call the generatePricing tool without asking further questions. The tool will show a form for the user to fill in details.',
        "Only use tools when the user explicitly requests related functionality",
        "If a user changes topic, completely abandon the previous context and respond to their new question",
        "Always format your responses using markdown: Use **bold** for emphasis, Use *italics* for subtle emphasis, Avoid using ## and ### for headings, Use bullet lists and numbered lists when appropriate, Use > for quotes or highlights, Avoid using tables",
      ],
      contextReset:
        'When the conversation includes messages like "Let\'s start fresh" or "I understand you want to change the topic", treat this as a complete context reset and abandon any previous conversation thread.',
    })

    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      messages,
      temperature: 0.7,
      maxOutputTokens: 1000,
      system: systemPrompt,

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
        },
      },

      stopWhen: stepCountIs(5),
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
