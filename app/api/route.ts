import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();

  if (
    !process.env.SENDER_EMAIL ||
    !process.env.SENDER_PASSWORD ||
    !process.env.MAIN_EMAIL
  ) {
    return new Response("500", {
      status: 500,
    });
  }

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.MAIN_EMAIL,
    subject: `[FindServices] - Contact Form Submission: ${body.name}`,
    text: `
      -- Contact Form Submission > FindServices
  
      - Name: ${body.name}
      - Email: ${body.email}
      - Phone Number: ${body.phoneNumber}
      
      - Message:
      ${body.message}
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    return new Response("200");
  } catch (error) {
    return new Response("500");
  }
}
