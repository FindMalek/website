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

    console.log("Original messages:", JSON.stringify(rawMessages))

    // Sanitize messages to remove any pending tool calls
    const messages = sanitizeMessages(rawMessages as ChatMessage[])

    // Log for debugging
    console.log("Processed messages:", JSON.stringify(messages))

    const result = streamText({
      model: groq("llama3-70b-8192"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
      system: `You are a helpful assistant on a contact page. Your goal is to help visitors connect with the website owner.
      You can collect contact information, schedule meetings, provide pricing estimates, and provide access to the website owner's resume.
      
      Be friendly, professional, and helpful. Use the available tools ONLY when specifically appropriate and requested.
      
      IMPORTANT GUIDELINES:
      1. For general questions like "what's your name" or small talk, respond directly without using tools.
      2. Only use tools when the user explicitly requests related functionality (e.g., scheduling, pricing, resume).
      3. If a user changes topic, completely abandon the previous context and respond to their new question.
      4. If a user indicates they don't want to use a tool, stop suggesting it and answer directly.
      5. You don't have a specific name - you're simply the website assistant.
      6. Always format your responses using markdown:
         - Use **bold** for emphasis
         - Use *italics* for subtle emphasis
         - Use ## and ### for headings
         - Use bullet lists and numbered lists when appropriate
         - Use \`code blocks\` for technical terms or code
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
          description: "Schedule a meeting with the user",
          parameters: z.object({
            purpose: z.string().describe("The purpose of the meeting"),
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
