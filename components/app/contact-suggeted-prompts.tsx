"use client"

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
    <div className="border-t p-4 font-mono">
      <p className="text-muted-foreground mb-2 text-xs"># try one of these</p>
      <div className="flex flex-col items-start gap-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            className="dither-hover text-foreground -mx-1 px-1 text-left text-sm"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <span className="text-chart-1 mr-2">$</span>
            {suggestion.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
