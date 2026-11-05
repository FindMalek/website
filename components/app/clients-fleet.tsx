import Image from "next/image"
import Link from "next/link"

import { CLIENTS } from "@/config/consts"

import { DitherFleet } from "@/components/dither/dither-fleet"
import { Badge } from "@/components/ui/badge"

/**
 * The companies I have worked with. The full view is a fleet of boats carrying
 * their logos; the simple view is a plain wrap of badges. Both are in the HTML
 * and CSS picks one, so the choice never needs a re-render. The hidden list
 * also serves screen readers in the full view.
 */
export function ClientsFleet() {
  return (
    <>
      <div className="relative h-44 sm:h-52 simple:hidden">
        <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2">
          <DitherFleet clients={CLIENTS} className="absolute inset-0" />
        </div>
      </div>

      <ul className="sr-only simple:not-sr-only simple:flex simple:flex-wrap simple:gap-2 simple:p-4">
        {CLIENTS.map((client) => {
          const badge = (
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
              {client.logo && (
                <Image
                  src={client.logo}
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5 object-contain"
                />
              )}
              <span className="text-xs font-medium">{client.name}</span>
            </Badge>
          )
          return (
            <li key={client.name}>
              {client.href ? (
                <Link href={client.href} target="_blank" rel="noopener">
                  {badge}
                </Link>
              ) : (
                badge
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
