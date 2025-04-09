import { BOOKS } from "@/config/consts"

import { AboutBooksItem } from "@/components/app/about-books-item"
import { SectionHeading } from "@/components/shared/section-heading"

export function AboutBooks() {
  return (
    <section className="mb-32">
      <SectionHeading title="Reading list" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {BOOKS.map((book) => (
          <AboutBooksItem key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
