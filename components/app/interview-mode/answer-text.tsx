type AnswerTextProps = {
  lines: string[]
  count: number
  done: boolean
  onSkip: () => void
}

export function AnswerText({ lines, count, done, onSkip }: AnswerTextProps) {
  if (done) {
    return (
      <div className="space-y-2 text-sm leading-relaxed sm:text-base">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    )
  }

  const starts = lines.map((_, index) =>
    lines.slice(0, index).reduce((sum, line) => sum + line.length, 0)
  )

  return (
    <div
      onClick={onSkip}
      className="cursor-pointer space-y-2 text-sm leading-relaxed sm:text-base"
    >
      <p className="sr-only">{lines.join(" ")}</p>
      {lines.map((line, index) => {
        const shown = line.slice(0, Math.max(0, count - starts[index]))
        return (
          <p key={line} aria-hidden>
            <span>{shown}</span>
            <span className="invisible">{line.slice(shown.length)}</span>
          </p>
        )
      })}
    </div>
  )
}
