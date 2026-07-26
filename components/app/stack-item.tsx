import Image from "next/image"
import Link from "next/link"

import { env } from "@/env"
import type { StackItem as StackItemType } from "@/types"

interface StackItemProps {
  item: StackItemType
}

export function StackItem({ item }: StackItemProps) {
  return (
    <Link
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-secondary/50 hover:bg-secondary inset-ring-border font-mono text-foreground flex h-6 items-center gap-1.5 rounded-full px-2 text-xs inset-ring-1 transition-colors"
    >
      <Image
        src={`${item.imageUrl}?token=${env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=32`}
        alt=""
        width={14}
        height={14}
        className="size-3.5 shrink-0 rounded-xs"
        aria-hidden
      />
      {item.title}
    </Link>
  )
}
