import * as React from "react"
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { ContactEmailIntroductionProps } from "@/types"

// Sample conversation history
const sampleConversation = [
  { role: "bot", message: "Hello! How can I help you today?" },
  { role: "user", message: "I have a question about your services." },
  {
    role: "bot",
    message:
      "Of course! I'd be happy to help with any questions about our services. What would you like to know?",
  },
  { role: "user", message: "Do you offer custom solutions?" },
  {
    role: "bot",
    message:
      "Yes, we specialize in creating custom solutions tailored to your specific needs. Would you like to discuss your requirements with our team?",
  },
]

const ContactEmailIntroduction = ({
  userName = "there",
  userEmail = "user@example.com",
  contactPurpose = "General Inquiry",
  conversation = sampleConversation,
}: ContactEmailIntroductionProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Thanks for reaching out to me about your {contactPurpose.toLowerCase()}!
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50 py-[40px] font-sans">
          <Container className="mx-auto my-[20px] max-w-[550px] rounded-[12px] bg-white p-[32px] shadow-sm">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 text-[28px] font-bold text-cyan-600">
                Thank You for Contacting Me
              </Heading>
              <Text className="mb-0 mt-[8px] text-[16px] text-gray-500">
                I&apos;ve received your {contactPurpose.toLowerCase()}
              </Text>
            </Section>

            <Hr className="my-[24px] h-[2px] border-none bg-gradient-to-r from-cyan-300 to-cyan-500" />

            <Section>
              <Text className="text-[16px] leading-[26px] text-gray-700">
                Hi {userName},
              </Text>

              <Text className="text-[16px] leading-[26px] text-gray-700">
                Thank you for reaching out regarding your{" "}
                <span className="font-semibold text-cyan-600">
                  {contactPurpose}
                </span>
                . I&apos;ve received your message and will get back to you at{" "}
                <Link
                  href={`mailto:${userEmail}`}
                  className="font-medium text-cyan-600"
                >
                  {userEmail}
                </Link>{" "}
                as soon as possible.
              </Text>

              <Text className="mb-[16px] text-[16px] leading-[26px] text-gray-700">
                Here&apos;s a record of your conversation with me:
              </Text>
            </Section>

            <Section className="mb-[24px] rounded-[12px] border border-gray-100 bg-gray-50 p-[20px]">
              {conversation.map((item, index) => (
                <Row key={index} className="mb-[12px]">
                  {!(item.role === "user") ? (
                    <>
                      <Column width="24px" className="pt-[4px] align-top">
                        <Section className="h-[24px] w-[24px] rounded-full bg-cyan-500 text-center text-[12px] font-bold leading-[24px] text-white">
                          B
                        </Section>
                      </Column>
                      <Column className="px-[8px]">
                        <Text className="m-0 inline-block max-w-[320px] rounded-[12px] border border-gray-200 bg-white p-[10px] text-[14px] leading-[20px] text-gray-800 shadow-sm">
                          {item.message}
                        </Text>
                      </Column>
                      <Column width="24px"></Column>
                    </>
                  ) : (
                    <>
                      <Column width="24px"></Column>
                      <Column className="px-[8px] text-right">
                        <Text className="m-0 inline-block max-w-[320px] rounded-[12px] bg-gradient-to-r from-cyan-500 to-cyan-600 p-[10px] text-[14px] leading-[20px] text-gray-800">
                          {item.message}
                        </Text>
                      </Column>
                      <Column width="24px" className="pt-[4px] align-top">
                        <Section className="h-[24px] w-[24px] rounded-full bg-gray-100 text-center text-[12px] font-bold leading-[24px] text-gray-800">
                          U
                        </Section>
                      </Column>
                    </>
                  )}
                </Row>
              ))}
            </Section>

            <Text className="text-[16px] leading-[26px] text-gray-700">
              I&apos;m reviewing your inquiry and will provide a personalized
              response shortly. If you need immediate assistance, please
              don&apos;t hesitate to reach out directly.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ContactEmailIntroduction.PreviewProps = {
  userName: "John Doe",
  userEmail: "john.doe@example.com",
  contactPurpose: "Product Consultation",
  conversation: sampleConversation,
}

export default ContactEmailIntroduction
