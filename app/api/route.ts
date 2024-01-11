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
		from: `FindMalek Mailer <` + process.env.SENDER_EMAIL + `>`,
		to: process.env.MAIN_EMAIL,
		subject: `[FindMalek] - Contact Form Submission: ${body.name}`,
		html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            .container {
              width: 80%;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            .header {
              font-size: 20px;
              color: #333;
            }
            .content {
              margin-top: 20px;
            }
            .content p {
              margin: 5px 0;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              text-align: center;
            }
            a {
              color: #007bff;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Contact Form Submission > FindMalek</h2>
            </div>
            <div class="content">
              <p><strong>Full Name:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone Number:</strong> ${body.phoneNumber}</p>

              <h3>Message:</h3>
              <p>${body.message}</p>
            </div>
            <div class="footer">
              <p>
			 	This email was sent by FindMalek Mailer. If you have any questions. 
			  </p>
            </div>
          </div>
        </body>
      </html>
    `,
	};

	try {
		await mailTransporter.sendMail(mailOptions);
		return new Response("200");
	} catch (error) {
		return new Response("500");
	}
}
