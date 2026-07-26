import Image from "next/image"
import Link from "next/link"

import type { Client } from "@/types"

import { CLIENTS } from "@/config/consts"
import { cn } from "@/lib/utils"

import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/app/panel"
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
          className="object-contain"
        />
      </div>
      <span className="text-xs font-medium">{client.name}</span>
    </Badge>
  )
}

/**
 * Renders globally, on every route, directly above the Footer -- see
 * app/layout.tsx. Not homepage-only and not part of useActiveSection's
 * tracked ids (no nav entry for this one).
 */
export function ClientsSection() {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle className="text-lg">
          Companies I&apos;ve worked with
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="flex flex-wrap justify-center gap-3">
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
      </PanelContent>
    </Panel>
  )
}
