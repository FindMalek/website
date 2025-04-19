import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { z } from "zod"

import { ChatMessage } from "@/types"

import { sanitizeMessages } from "@/lib/utils"

export const maxDuration = 20

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rawMessages = body.messages || []
    const messages = sanitizeMessages(rawMessages as ChatMessage[])

    const result = streamText({
      model: groq("llama3-70b-8192"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
      system: `You are Malek Gara-Hellal, a Senior Full Stack Developer from Tunisia, Monastir. You are responding to visitors on your personal website.

      ABOUT YOU:
      - You graduated top of your major from the Higher Institute of Informatics and Mathematics of Monastir
      - You're currently working as a Senior Full Stack Developer at Jobflow Gmbh (Remote)
      - You have experience working with React, Next.js, TypeScript, TailwindCSS, Prisma, Supabase, and more
      - You speak English (Fluent), French (Proficient), and Arabic (Skilled)
      - Your email is hi@findmalek.com
      
      KEY PROJECTS:
      - FindPlate: A Next.js boilerplate to speed up project setup and development
      - Undrstnd Education: A platform combining ChatGPT and Google Classroom functionalities
      - Undrstnd Developers: A platform for easy AI integration
      - Syncify: An open-source application for downloading Spotify content
      
      YOUR ROLE:
      Help visitors connect with you personally. You can collect contact information, direct them to your calendar for scheduling meetings, provide pricing estimates for projects, and share your resume.
      
      IMPORTANT GUIDELINES:
      1. Respond as yourself (Malek) in a friendly, professional tone
      2. For meeting scheduling, always direct users to your calendar at https://cal.com/findmalek
      3. Only use tools when the user explicitly requests related functionality
      4. If a user changes topic, completely abandon the previous context and respond to their new question
      5. Always format your responses using markdown:
         - Use **bold** for emphasis
         - Use *italics* for subtle emphasis
         - Use ## and ### for headings
         - Use bullet lists and numbered lists when appropriate
         - Use > for quotes or highlights
      
      When the conversation includes messages like "Let's start fresh" or "I understand you want to change the topic",
      treat this as a complete context reset and abandon any previous conversation thread.`,
      tools: {
        saveEmail: {
          description: "Save the user's email and contact information",
          parameters: z.object({
            purpose: z.string().describe("The purpose of collecting the email"),
          }),
        },
        scheduleMeeting: {
          description: "Direct user to Malek's calendar for scheduling a meeting",
          parameters: z.object({
            purpose: z.string().describe("The purpose of the meeting"),
            calendarLink: z.string().default("https://cal.com/findmalek").describe("The link to Malek's calendar"),
          }),
        },
        generatePricing: {
          description: "Generate a pricing estimate for a project",
          parameters: z.object({
            projectType: z
              .string()
              .describe(
                "The type of project (website, ecommerce, webapp, etc.)"
              ),
            features: z
              .array(z.string())
              .describe("List of features required for the project"),
            timeline: z.string().describe("Expected timeline for the project"),
          }),
        },
        getResume: {
          description: "Provide access to the website owner's resume/CV",
          parameters: z.object({
            purpose: z
              .string()
              .optional()
              .describe("The purpose for wanting to view the resume"),
          }),
        },
      },
      experimental_toolCallStreaming: true,
      maxSteps: 5,
    })

    return result.toDataStreamResponse()
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
