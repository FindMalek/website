import Link from "next/link"
import { usePathname } from "next/navigation"

import { DesktopNavigationType, NavItemType } from "@/types"

import { NAV_ITEMS } from "@/config/consts"
import { cn } from "@/lib/utils"

function NavItem({ href, children }: NavItemType) {
  const isActive = usePathname() === href

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "relative block px-2 py-1.5 text-base transition",
          isActive
            ? "text-cyan-900 dark:text-cyan-400"
            : "hover:text-cyan-900 dark:hover:text-cyan-400"
        )}
      >
        {children}
        {isActive && (
          <span
            className={cn(
              "absolute inset-x-1 -bottom-px h-px",
              "bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0",
              "dark:from-cyan-400/0 dark:via-cyan-400/40 dark:to-cyan-400/0"
            )}
          />
        )}
      </Link>
    </li>
  )
}

export function HeaderDesktop(props: DesktopNavigationType) {
  return (
    <nav {...props}>
      <ul
        className={cn(
          "flex rounded-full",
          "bg-white/50 backdrop-blur",
          "text-zinc-800 dark:text-zinc-200",
          "shadow-lg shadow-zinc-900/15 dark:shadow-zinc-800/5",
          "ring-1 ring-zinc-900/5 dark:ring-white/10",
          "px-2 py-0.5 font-medium",
          "md:px-3 lg:px-3",
          "dark:bg-zinc-900/70"
        )}
      >
        {Object.values(NAV_ITEMS).map((item) => (
          <NavItem key={item.path} href={item.path}>
            {item.name}
          </NavItem>
        ))}
      </ul>
    </nav>
  )
}
