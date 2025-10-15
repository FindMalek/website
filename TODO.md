# TODO List

## Layout Enhancements

- [ ] Create a transition effect for loading more components smoothly into the page.

## Projects Page

- [x] Create an open-source section using the GitHub API to load the number of stars for each project.
- [x] Hardcode the projects in the `consts.ts` file.

## Stack Page

- [x] Create a component for each section.
- [x] Ensure the section title is under a `Separator` component.
- [x] Add padding between each component.

## Contact Page

- [x] Create a chatbot with well-made tool calls.
- [x] Implement a tool call to save the client's email and send it to myself and the client (Using Resend).
- [x] Add a confirmation message to ensure the email is sent (Send the whole conversation in the email).
- [x] Implement a tool call to create a meeting (Use Cal.com).
- [x] Create a component to generate pricing estimations (Chat AI SDK).
- [x] Tool call to generate and download a resume PDF.
- [ ] Tool call to integrate a feedback form for visitors.

## Nested pages

- [ ] Fix the '404' background to suppor the page 'name'

# Hardcoded Contact Form Flow

This feature implements a structured, hardcoded conversation flow for collecting contact information instead of using AI-generated responses. The flow follows these steps:

1. When the user expresses interest in contacting the site owner (by saying something like "I would like to contact you"), the form flow is triggered.
2. The assistant responds with a hardcoded message asking for the purpose of contact.
3. When the user provides their purpose, the system saves it and prompts for their email address.
4. When the user provides their email, the system saves it and asks for their name.
5. After collecting all information, a confirmation component is displayed showing the collected data with a button to submit.
