import Image from "next/image"
import Link from "next/link"

import { WorkRo } from "@/config/schemas"
import { cn } from "@/lib/utils"

import { WorkDateWithTooltip } from "@/components/app/work-date-with-tooltip"

export function WorkCardCompact({ work }: { work: WorkRo }) {
  const { logo, logoClassName, company, position, startDate, endDate, href } =
    work

  return (
    <Link
      href={href}
      className="border-foreground/10 hover:border-primary/30 hover:bg-muted/50 group flex items-center gap-3 rounded-xl border p-3 transition-all duration-200"
    >
      <div className="border-border size-9 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={logo}
          alt={`${company} logo`}
          width={36}
          height={36}
          className={cn("size-full object-cover", logoClassName)}
        />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {position} <span className="text-muted-foreground">· {company}</span>
          </p>
        </div>
        <span className="text-muted-foreground hidden shrink-0 text-xs sm:inline">
          <WorkDateWithTooltip startDate={startDate} endDate={endDate} />
        </span>
      </div>
    </Link>
  )
}
