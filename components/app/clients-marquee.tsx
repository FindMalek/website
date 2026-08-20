import Image from "next/image"
import Link from "next/link"

import type { Client } from "@/types"

import { CLIENTS } from "@/config/consts"
import { cn } from "@/lib/utils"

import { Marquee } from "@/components/ui/marquee"
import { Badge } from "@/components/ui/badge"

function ClientBadge({ client }: { client: Client }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1",
        "duration-300 hover:shadow-sm",
        "hover:bg-secondary/50 hover:text-secondary-foreground hover:border-secondary-foreground transition-all"
      )}
      style={{
        backgroundColor: client.color,
        color: client.textColor || "inherit",
      }}
    >
      <div className="relative size-3.5 flex-shrink-0">
        <Image
          src={client.logo || "/clients/placeholder.ico"}
          alt={`${client.name} logo`}
          fill
          sizes="14px"
          className="object-contain"
        />
      </div>
      <span className="text-xs font-medium">{client.name}</span>
    </Badge>
  )
}

/**
 * Homepage-only, rendered directly under the "work" Panel in app/page.tsx.
 * Previously a global ClientsSection repeated on every route above Footer --
 * see issue #67.
 */
export function ClientsMarquee() {
  return (
    <Marquee pauseOnHover className="[--duration:30s]">
      {CLIENTS.map((client, index) =>
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
    </Marquee>
  )
}
