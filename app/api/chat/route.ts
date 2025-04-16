import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { z } from "zod"

export const maxDuration = 300

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: groq("llama3-70b-8192"),
    messages,
    temperature: 0.7,
    maxTokens: 1000,
    system: `You are a helpful assistant on a contact page. Your goal is to help visitors connect with the website owner.
    You can collect contact information, schedule meetings, provide pricing estimates, generate resumes, and collect feedback.
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
          projectType: z.string().describe("The type of project (website, ecommerce, webapp, etc.)"),
          features: z.array(z.string()).describe("List of features required for the project"),
          timeline: z.string().describe("Expected timeline for the project"),
        }),
      },
      generateResume: {
        description: "Generate and download a resume PDF",
        parameters: z.object({
          skills: z.array(z.string()).optional().describe("List of skills to highlight"),
          experience: z.string().optional().describe("Brief description of experience"),
        }),
      },
      submitFeedback: {
        description: "Submit feedback about the service",
        parameters: z.object({
          feedbackType: z.string().describe("Type of feedback (general, suggestion, complaint)"),
        }),
      },
    },
    experimental_toolCallStreaming: true,
    maxSteps: 5,
  })

  return result.toDataStreamResponse()
}
