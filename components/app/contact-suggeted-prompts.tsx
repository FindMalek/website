"use client"

import { Button } from "@/components/ui/button"

interface SuggestedPromptsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function ContactSuggestedPrompts({
  onSuggestionClick,
}: SuggestedPromptsProps) {
  const suggestions = [
    "I'd like to contact you",
    "Schedule a meeting",
    "Get a price estimate for my project",
    "View your resume/CV",
    "What can you help me with?",
    "Let's chat",
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
