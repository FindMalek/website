import { ChangeEvent, FormEvent, KeyboardEvent, RefObject } from "react"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatContextProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  inputRef: RefObject<HTMLInputElement | null>
  handleFormSubmit: (e: FormEvent) => void
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}

interface ContactChatInputProps {
  chatContext: ChatContextProps
  isLoading: boolean
  isCancelling: boolean
}

export function ContactChatInput({
  chatContext,
  isLoading,
  isCancelling,
}: ContactChatInputProps) {
  const {
    input,
    handleInputChange,
    inputRef,
    handleFormSubmit,
    handleKeyDown,
  } = chatContext

  return (
    <form onSubmit={handleFormSubmit} className="flex space-x-2">
      <Input
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1"
        disabled={isLoading || isCancelling}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !input.trim() || isCancelling}
      >
        <Icons.send className="h-4 w-4" />
      </Button>
    </form>
  )
}
