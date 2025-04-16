import Image from "next/image"
import Link from "next/link"

import { env } from "@/env"
import type { StackItem as StackItemType } from "@/types"

import { Icons } from "@/components/shared/icons"

interface StackItemProps {
  item: StackItemType
}

export function StackItem({ item }: StackItemProps) {
  return (
    <Link
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="border-secondary hover:border-secondary hover:bg-secondary-foreground/25 group flex gap-4 rounded-lg border p-5 shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <div className="border-secondary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border bg-white">
        <Image
          src={`${item.imageUrl}?token=${env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=48`}
          alt={item.title}
          width={28}
          height={28}
        />
      </div>
      <div className="flex-grow">
        <h3 className="flex items-center font-medium">
          <span className="group-hover:text-primary flex items-center transition-colors">
            {item.title}
            <Icons.externalLink className="ml-1.5 h-3.5 w-3.5 opacity-70" />
          </span>
        </h3>
        <p className="text-muted-foreground mt-1 text-sm transition-colors">
          {item.description}
        </p>
      </div>
    </Link>
  )
}
