"use client"

import { Button } from "@/components/ui/button"

interface SuggestedPromptsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function ContactSuggestedPrompts({
  onSuggestionClick,
}: SuggestedPromptsProps) {
  const suggestions = [
    "Advice me about this",
    "Let's connect",
    "Ask me what I can do",
    "Schedule a meeting?",
    "Experience on Ecommerce",
    "I want to hire you!",
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
