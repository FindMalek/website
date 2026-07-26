import Image from "next/image"
import Link from "next/link"
import { Work } from "content-collections"

import { cn, WorkExperienceGroup } from "@/lib/utils"

import { WorkPositionItem } from "@/components/app/work-position-item"

export function WorkExperienceItem({
  group,
}: {
  group: WorkExperienceGroup<Work>
}) {
  const {
    company,
    logo,
    logoClassName,
    link,
    location,
    isCurrentEmployer,
    positions,
  } = group

  return (
    <div className="border-foreground/10 border-b py-6 last:border-b-0">
      <div className="group flex items-center gap-3">
        <div className="border-border relative size-10 shrink-0 overflow-hidden rounded-md border">
          <Image
            src={logo}
            alt={`${company} logo`}
            fill
            className={cn(
              "object-cover grayscale transition-all duration-200 group-hover:grayscale-0",
              logoClassName
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {link ? (
              <Link
                href={link}
                target="_blank"
                rel="noopener"
                className="truncate text-sm font-semibold hover:underline"
              >
                {company}
              </Link>
            ) : (
              <span className="truncate text-sm font-semibold">{company}</span>
            )}

            {isCurrentEmployer && (
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
            )}
          </div>

          {location && (
            <p className="text-muted-foreground text-xs">{location}</p>
          )}
        </div>
      </div>

      <div className="border-foreground/10 divide-foreground/10 ml-5 mt-2 divide-y border-l border-dashed pl-5">
        {positions.map((position) => (
          <WorkPositionItem key={position.id} work={position} />
        ))}
      </div>
    </div>
  )
}
