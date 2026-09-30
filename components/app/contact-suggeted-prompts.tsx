"use client"

import { Button } from "@/components/ui/button"

interface SuggestedPromptsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function ContactSuggestedPrompts({
  onSuggestionClick,
}: SuggestedPromptsProps) {
  const suggestions = [
    "What are you working on?",
    "What's your stack?",
    "How much would my project cost?",
    "Can we hop on a call?",
    "Send me your CV",
    "I want to reach you",
  ]

  return (
    <div className="border-t p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="rounded-full text-sm"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
