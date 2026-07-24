interface ArticleContentProps {
  className?: string
  children: React.ReactNode
}

/**
 * Marks case-study body content as eligible for highlight-to-ask
 * (see hooks/use-highlight-to-ask.ts). Deliberately not used on the
 * one-pager -- highlight-to-ask is case-study-only by design.
 */
export function ArticleContent({ className, children }: ArticleContentProps) {
  return (
    <div data-ask-enabled="true" className={className}>
      {children}
    </div>
  )
}
