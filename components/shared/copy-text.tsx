"use client"

import { cn } from "@/lib/utils"
import { useCopyClipboard } from "@/hooks/use-copy-clipboard"

import { Icons } from "@/components/shared/icons"

interface CopyTextProps {
  text: string
  className?: string
  children?: React.ReactNode
  duration?: number
}

export function CopyText({
  text,
  className,
  children,
  duration = 2000,
}: CopyTextProps) {
  const { copied, copy } = useCopyClipboard({ duration })

  return (
    <span
      onClick={() => copy(text)}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-1",
        className
      )}
    >
      {children}
      {text}
      <span className="opacity-0 transition-opacity group-hover:opacity-100">
        {copied ? (
          <Icons.check className="h-4 w-4 text-green-500" />
        ) : (
          <Icons.copy className="h-4 w-4" />
        )}
      </span>
    </span>
  )
}
