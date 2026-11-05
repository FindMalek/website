import Link from "next/link"
import { usePathname } from "next/navigation"

import { DesktopNavigationType, NavItemType } from "@/types"

import { NAV_ITEMS } from "@/config/consts"
import { cn, scrollToAnchorSection } from "@/lib/utils"
import { useActiveSection } from "@/hooks/use-active-section"

import { ModeToggleCompact } from "@/components/shared/mode-toggle"

function NavItem({ href, children, isActive }: NavItemType) {
  const pathname = usePathname()

  return (
    <li>
      <Link
        href={href}
        onClick={(e) => {
          if (scrollToAnchorSection(href, pathname)) e.preventDefault()
        }}
        className={cn(
          "dither-hover relative block px-3 py-1.5 text-sm lowercase transition-colors",
          isActive
            ? "dither-active text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {children}
      </Link>
    </li>
  )
}

export function HeaderDesktop(props: DesktopNavigationType) {
  const activeSection = useActiveSection([
    "work",
    "projects",
    "stack",
    "about",
  ])

  return (
    <nav {...props}>
      <ul
        className={cn(
          "border-foreground/25 bg-background/85 flex rounded-none border",
          "px-1 py-0.5 font-mono"
        )}
      >
        {Object.values(NAV_ITEMS).map((item) => (
          <NavItem
            key={item.path}
            href={item.path}
            isActive={item.path.split("#")[1] === activeSection}
          >
            {item.name}
          </NavItem>
        ))}
        <li className="border-foreground/25 ml-1 flex items-center border-l pl-1">
          <ModeToggleCompact />
        </li>
      </ul>
    </nav>
  )
}
