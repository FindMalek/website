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

- [ ] Create a chatbot with well-made tool calls.
- [ ] Implement a tool call to save the client's email and send it to myself and the client (Using Resend).
- [ ] Add a confirmation message to ensure the email is sent (Send the whole conversation in the email).
- [ ] Implement a tool call to create a meeting (Use Cal.com).
- [ ] Create a component to generate pricing estimations (Chat AI SDK).
- [ ] Tool call to generate and download a resume PDF.
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

## Implementation Details

### Components

- `contact-form-handler.tsx`: Main component that manages the display of the form confirmation at the appropriate stage
- `contact-form-confirmation.tsx`: Component that displays the collected data with a submit button

### Hooks

- `use-contact-form-flow.ts`: Core hook that manages the conversation state and flow logic

### Flow States

- `initial`: Waiting for a trigger message from the user
- `asking_purpose`: Prompted user for the purpose, waiting for response
- `asking_email`: Prompted user for their email, waiting for response
- `asking_name`: Prompted user for their name, waiting for response
- `confirmation`: All information collected, showing confirmation component

## How It Works

1. The hook monitors chat messages for a trigger phrase containing "contact you"
2. When detected, it appends a hardcoded assistant message asking for purpose
3. As the user responds to each prompt, their answers are saved and the next prompt is automatically displayed
4. The flow culminates in a confirmation view where the user can verify and submit their information
5. After submission, a success message is shown

## Preventing Infinite Message Loops

To prevent the system from repeatedly prompting the user with the same message:

1. We track the ID of the triggering message to ensure we only respond once to it
2. We use stage-based progression to ensure clear state transitions
3. We verify the sequence of messages to ensure the user's reply came after the assistant's prompt
4. We check message content to ensure we're responding to the right prompt
5. We carefully manage state updates to avoid unnecessary re-renders

## Benefits

- More consistent user experience
- No reliance on AI-generated prompts that might vary
- Structured data collection in a conversational format
- Works well even with limited or no AI response
