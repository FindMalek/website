import { Check, CircleAlert, CircleDashed } from "lucide-react"

import type { MatchState } from "@/hooks/use-interview-flow"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { ProofChips } from "./proof-chips"

const ERROR_COPY: Record<string, string> = {
  "not-a-job-post":
    "That did not look like a job post. Paste the description text and try again.",
  "unreadable-page":
    "I could not read that page, some job sites block it. Paste the text of the post instead.",
  "too-long": "That is too long. Paste the main requirements, about a page.",
  "rate-limited": "A lot of requests just came in. Try again in a few minutes.",
  empty: "Paste the job post or a link first.",
}

type MatchViewProps = {
  match: MatchState
  onRetry: () => void
  onNext: () => void
}

export function MatchView({ match, onRetry, onNext }: MatchViewProps) {
  return (
    <article aria-labelledby="card-match" className="space-y-5">
      <h3
        id="card-match"
        className="font-heading text-xl font-semibold leading-snug sm:text-2xl"
      >
        {match.status === "done" && match.data.role
          ? `How I match: ${match.data.role}`
          : "How I match this role"}
      </h3>

      {match.status === "loading" && (
        <div className="space-y-3" aria-hidden>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {match.status === "error" && (
        <div className="space-y-3">
          <p>
            {ERROR_COPY[match.code] ??
              "I could not read the role just now. The questions still work, and you can try again."}
          </p>
          {match.code !== "not-a-job-post" && match.code !== "too-long" && (
            <Button variant="outline" onClick={onRetry} data-autofocus>
              Try again
            </Button>
          )}
        </div>
      )}

      {match.status === "done" && (
        <div className="space-y-6">
          <p className="text-sm leading-relaxed sm:text-base">
            {match.data.summary}
          </p>

          {match.data.matches.length > 0 && (
            <section aria-labelledby="match-strong" className="space-y-3">
              <h4
                id="match-strong"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <Check aria-hidden className="size-4 text-emerald-600" />
                Real evidence
              </h4>
              <ul className="space-y-3">
                {match.data.matches.map((item) => (
                  <li
                    key={item.requirement}
                    className="space-y-2 rounded-xl border p-3"
                  >
                    <p className="text-sm font-medium">{item.requirement}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.claim}
                    </p>
                    <ProofChips chips={item.proof} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {match.data.partials.length > 0 && (
            <section aria-labelledby="match-partial" className="space-y-3">
              <h4
                id="match-partial"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <CircleDashed aria-hidden className="size-4 text-amber-600" />
                Partly
              </h4>
              <ul className="space-y-3">
                {match.data.partials.map((item) => (
                  <li
                    key={item.requirement}
                    className="space-y-2 rounded-xl border p-3"
                  >
                    <p className="text-sm font-medium">{item.requirement}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.have} Missing: {item.missing}
                    </p>
                    <ProofChips chips={item.proof} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {match.data.gaps.length > 0 && (
            <section aria-labelledby="match-gaps" className="space-y-3">
              <h4
                id="match-gaps"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <CircleAlert aria-hidden className="size-4 text-rose-600" />
                Honest gaps
              </h4>
              <ul className="space-y-3">
                {match.data.gaps.map((item) => (
                  <li
                    key={item.requirement}
                    className="space-y-1 rounded-xl border border-dashed p-3"
                  >
                    <p className="text-sm font-medium">
                      Gap: {item.requirement}
                    </p>
                    <p className="text-muted-foreground text-sm">{item.note}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Button size="lg" className="h-11" onClick={onNext} data-autofocus>
            Next
          </Button>
        </div>
      )}
    </article>
  )
}
