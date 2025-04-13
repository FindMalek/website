import Image from "next/image"
import Link from "next/link"

import type { Client } from "@/types"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

interface ClientShowcaseProps {
  clients: Client[]
}

export function ClientShowcase({ clients }: ClientShowcaseProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {clients.map((client, index) => (
        <Link href={client.href || "#"} key={index} target="_blank">
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-2 px-4 py-2",
              "transition-shadow duration-200 hover:shadow-sm"
            )}
            style={{
              backgroundColor: client.color,
              color: client.textColor || "inherit",
            }}
          >
            {client.logo && (
              <div className="relative h-5 w-5 flex-shrink-0">
                <Image
                  src={client.logo || "/placeholder.svg"}
                  alt={`${client.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-sm font-medium">{client.name}</span>
          </Badge>
        </Link>
      ))}
    </div>
  )
}
