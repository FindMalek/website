import Image from "next/image"

import { cn } from "@/lib/utils"

type Book = {
  id: string
  link: string
  image: string
  title: string
  author: string
}

export function AboutBooksItem({ book }: { book: Book }) {
  return (
    <a
      key={book.id}
      href={book.link}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group relative flex h-full flex-row items-center justify-center gap-4 overflow-hidden rounded-xl border p-4 transition-all",
        "hover:bg-background hover:-translate-y-1 hover:shadow-sm sm:flex-col sm:p-8 sm:text-center"
      )}
    >
      <div
        className={cn(
          "relative w-20 shrink-0 [perspective:800px]",
          "sm:mx-auto sm:w-[70%]"
        )}
      >
        {/* Stacked page edges -- thin offset layers behind the cover simulate
            a closed book's page block, visible on the right/bottom. */}
        <div
          aria-hidden
          className="border-border/60 bg-muted absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-sm border"
        />
        <div
          aria-hidden
          className="border-border/80 bg-muted absolute inset-0 translate-x-[1.5px] translate-y-[1.5px] rounded-sm border"
        />

        <div
          className={cn(
            "relative origin-left overflow-hidden rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-out",
            "after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:bg-[linear-gradient(90deg,rgba(0,0,0,0.118)_0.65%,rgba(255,255,255,0.2)_1.53%,rgba(255,255,255,0.1)_2.38%,rgba(0,0,0,0.05)_3.26%,rgba(255,255,255,0.14)_5.68%,rgba(244,244,244,0)_6.96%)] after:shadow-[inset_0_0_0_1px_rgba(15,15,15,0.1)] after:content-['']",
            "group-hover:shadow-[4px_4px_10px_rgba(0,0,0,0.2)] group-hover:[transform:rotateY(-25deg)]"
          )}
        >
          {book.image ? (
            <Image
              src={book.image}
              alt={book.title}
              width={100}
              height={100}
              className="size-full object-cover"
            />
          ) : (
            <div className="bg-muted flex aspect-[128/193] w-full items-center justify-center p-4">
              <span className="text-muted-foreground line-clamp-3 text-xs font-medium">
                {book.title}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 sm:flex-initial">
        <p className="line-clamp-2 text-sm">{book.title}</p>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {book.author}
        </p>
      </div>
    </a>
  )
}
