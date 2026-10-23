import { ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type ChatInputProps = {
  value: string
  disabled: boolean
  limitReached: boolean
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
}

export function ChatInput({
  value,
  disabled,
  limitReached,
  onChange,
  onSubmit,
}: ChatInputProps) {
  if (limitReached) {
    return (
      <p className="text-muted-foreground p-3 text-center text-sm">
        Message limit reached for this conversation.
      </p>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (value.trim() && !disabled) onSubmit()
      }}
      className="flex items-end gap-2"
    >
      <label htmlFor="interview-chat" className="sr-only">
        Ask me anything about my work
      </label>
      <Textarea
        id="interview-chat"
        value={value}
        onChange={onChange}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }
        }}
        rows={1}
        placeholder="Ask me anything, I know which card you are on"
        className="max-h-32 min-h-11 resize-none rounded-xl text-base sm:text-sm"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Send question"
        disabled={disabled || !value.trim()}
        className="size-11 shrink-0 rounded-xl"
      >
        <ArrowUp aria-hidden />
      </Button>
    </form>
  )
}
