import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, name, message, conversation } = await req.json()
    
    console.log("Send email API called with:", { email, name, message })
    console.log("Conversation context:", conversation)
    
    // In a real application, you would send emails here using a service like Nodemailer, SendGrid, etc.
    // For now, we'll just simulate a successful response
    
    // Simulating a small delay to make it feel realistic
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({ 
      success: true, 
      ownerEmailSent: true, 
      userEmailSent: true 
    })
  } catch (error) {
    console.error("Error in send-email API:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    )
  }
} 