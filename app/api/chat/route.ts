import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { z } from "zod"

export const maxDuration = 20

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: groq("llama3-70b-8192"),
    messages,
    temperature: 0.7,
    maxTokens: 1000,
    system: `You are a helpful assistant on a contact page. Your goal is to help visitors connect with the website owner.
    You can collect contact information, schedule meetings, provide pricing estimates, and provide access to the website owner's resume.
    Be friendly, professional, and helpful. Use the available tools when appropriate.`,
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
            .describe("The type of project (website, ecommerce, webapp, etc.)"),
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
}
