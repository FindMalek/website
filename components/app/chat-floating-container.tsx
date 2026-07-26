"use client"

import { useChatDock } from "@/providers/chat-provider"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useContactChat } from "@/hooks/use-contact-chat"

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { PromptInputSubmit } from "@/components/ai-elements/prompt-input"
import { ContactChatBotErrorMessage } from "@/components/app/contact-chat-bot-error-message"
import { ContactChatMessage } from "@/components/app/contact-chat-message"
import { ContactSuggestedPrompts } from "@/components/app/contact-suggeted-prompts"
import { Icons } from "@/components/shared/icons"
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group"

export function ChatFloatingContainer() {
  const { dockState, closeChat } = useChatDock()
  const {
    messages,
    hasError,
    errorMessage,
    isLoading,
    isCancelling,
    showSuggestions,
    handleSuggestionClick,
    input,
    handleInputChange,
    inputRef,
    handleFormSubmit,
    isMessageLimitReached,
  } = useContactChat()

  const isDocked = dockState === "docked"

  return (
    <>
      <AnimatePresence>
        {isDocked && (
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
        className={cn(
          "fixed inset-x-0 z-50 mx-auto flex w-full flex-col px-4",
          isDocked
            ? "bottom-0 max-w-2xl pb-[calc(env(safe-area-inset-bottom)+1rem)]"
            : "bottom-6 max-w-lg"
        )}
      >
        {isDocked && (
          <div className="bg-background/95 mb-2 flex max-h-[60vh] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur">
            <Conversation className="max-h-[60vh]">
              <ConversationContent>
                {messages.map((message) => (
                  <ContactChatMessage key={message.id} message={message} />
                ))}
                {(isLoading || isCancelling) && (
                  <div className="bg-muted/50 flex w-fit max-w-[80%] items-center space-x-2 rounded-lg p-3">
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                    <p className="animate-text-gradient font-base inline-flex bg-gradient-to-r from-[#535353] via-[#c9c9c9] to-[#535353] bg-[200%_auto] bg-clip-text text-center text-xs text-transparent dark:from-[#ACACAC] dark:via-[#363636] dark:to-[#ACACAC]">
                      Thinking...
                    </p>
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            {showSuggestions && messages.length === 1 && (
              <ContactSuggestedPrompts
                onSuggestionClick={handleSuggestionClick}
              />
            )}
          </div>
        )}

        {hasError && (
          <div className="mb-2 flex justify-center">
            <ContactChatBotErrorMessage message={errorMessage} />
          </div>
        )}

        {isMessageLimitReached ? (
          <div className="bg-muted text-muted-foreground rounded-2xl border p-3 text-center text-sm shadow-lg">
            Message limit reached for this conversation.
          </div>
        ) : (
          <form
            onSubmit={handleFormSubmit}
            className="pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
          >
            <InputGroup className="bg-background rounded-2xl shadow-lg">
              <InputGroupTextarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault()
                    e.currentTarget.form?.requestSubmit()
                  }
                }}
                placeholder="Ask me anything..."
                disabled={isLoading || isCancelling}
                rows={1}
              />
              <PromptInputSubmit
                status={isLoading ? "streaming" : undefined}
                disabled={isLoading || !input.trim() || isCancelling}
              />
            </InputGroup>
          </form>
        )}
      </motion.div>
    </>
  )
}
