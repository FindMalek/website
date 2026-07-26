import type { StackSection as StackSectionType } from "@/types"

import { StackItem } from "@/components/app/stack-item"

interface StackSectionProps {
  section: StackSectionType
  index: number
}

export function StackSection({ section, index }: StackSectionProps) {
  return (
    <div className="border-line grid gap-x-4 gap-y-2 border-b py-4 last:border-none sm:grid-cols-[12rem_1fr]">
      <div className="text-muted-foreground flex h-6 items-center text-sm">
        <span
          className="text-muted-foreground/50 mr-1.5 font-mono select-none"
          aria-hidden
        >
          {(index + 1).toString().padStart(2, "0")}
        </span>
        {section.title}
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {section.items.map((item, itemIndex) => (
          <li key={itemIndex} className="flex">
            <StackItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}
