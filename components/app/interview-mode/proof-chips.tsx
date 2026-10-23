import type { ProofChip } from "@/data/journey"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

const KIND_LABEL: Record<ProofChip["kind"], string> = {
  "case-study": "case study",
  code: "code",
  post: "post",
  source: "source",
  contact: "contact",
}

type ProofChipsProps = {
  chips: { label: string; href: string; kind?: ProofChip["kind"] }[]
  className?: string
}

export function ProofChips({ chips, className }: ProofChipsProps) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => {
        const isMail = chip.href.startsWith("mailto:")
        return (
          <li key={`${chip.href}-${chip.label}`}>
            <a
              href={chip.href}
              {...(isMail ? {} : { target: "_blank", rel: "noopener" })}
              className="bg-muted/60 hover:bg-muted focus-visible:ring-ring inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs outline-none transition-colors focus-visible:ring-2"
            >
              {chip.kind && (
                <span className="font-mono uppercase tracking-wider">
                  {KIND_LABEL[chip.kind]}
                </span>
              )}
              <span>{chip.label}</span>
              <ArrowUpRight aria-hidden className="size-3" />
              {!isMail && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
