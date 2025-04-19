import Link from "next/link"

import { link } from "@/config/styles"
import { cn } from "@/lib/utils"

interface Direct {
  href: string
  text: string
  icon?: React.ReactNode
}

interface SectionHeadingProps {
  title: string
  description?: string
  direct?: Direct
  className?: string
}

export function SectionHeading({
  title,
  description,
  direct,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-6 flex items-center justify-between", className)}>
      <div>
        <h2 className="mb-2 text-3xl font-bold">{title}</h2>
        {description && (
          <p className="text-secondary-foreground/80">{description}</p>
        )}
      </div>
      {direct && (
        <Link
          href={direct.href}
          className="flex items-center gap-2 hover:underline"
        >
          <span
            className={cn("text-secondary-foreground hidden md:inline", link)}
          >
            {direct.text}
          </span>
          {direct.icon}
        </Link>
      )}
    </div>
  )
}
