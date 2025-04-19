import type { StackSection as StackSectionType } from "@/types"

import { StackItem } from "@/components/app/stack-item"
import { Separator } from "@/components/ui/separator"

interface StackSectionProps {
  section: StackSectionType
}

export function StackSection({ section }: StackSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-medium">{section.title}</h2>
        <Separator className="bg-secondary-foreground h-0.5 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {section.items.map((item, index) => (
          <StackItem key={index} item={item} />
        ))}
      </div>
    </div>
  )
}
