import Image from "next/image"
import Link from "next/link"

import type { Client } from "@/types"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

interface ClientShowcaseProps {
  clients: Client[]
}

function ClientBadge({ client }: { client: Client }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "flex items-center gap-2 px-4 py-2",
        "duration-300 hover:shadow-sm",
        "hover:bg-secondary/50 hover:text-secondary-foreground hover:border-secondary-foreground transition-all"
      )}
      style={{
        backgroundColor: client.color,
        color: client.textColor || "inherit",
      }}
    >
      <div className="relative h-5 w-5 flex-shrink-0">
        <Image
          src={client.logo || "/clients/placeholder.ico"}
          alt={`${client.name} logo`}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-sm font-medium">{client.name}</span>
    </Badge>
  )
}

export function ClientShowcase({ clients }: ClientShowcaseProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {clients.map((client, index) =>
        client.href ? (
          <Link href={client.href} key={index} target="_blank">
            <ClientBadge client={client} />
          </Link>
        ) : (
          <div key={index}>
            <ClientBadge client={client} />
          </div>
        )
      )}
    </div>
  )
}
