import Link from "next/link"

import { BOOKS } from "@/config/consts"

import { Icons } from "@/components/shared/icons"
import { SectionHeading } from "@/components/shared/section-heading"

export function AboutBooks() {
  return (
    <section
      id="readings"
      className="[scroll-margin-top:var(--header-height,6rem)]"
    >
      <SectionHeading
        title="Reading list"
        count={BOOKS.length}
        copyLinkSectionId="readings"
      />
      <ol className="divide-foreground/10 border-foreground/10 divide-y border-y">
        {BOOKS.map((book, index) => (
          <li key={book.id}>
            <Link
              href={book.link}
              target="_blank"
              rel="noreferrer noopener"
              className="dither-hover -mx-2 flex items-baseline gap-3 px-2 py-2 text-sm"
            >
              <span className="text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="truncate font-medium">{book.title}</span>
              <span className="text-muted-foreground hidden truncate sm:inline">
                {book.author}
              </span>
              <Icons.arrowUpRight className="text-muted-foreground ml-auto shrink-0 self-center" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
