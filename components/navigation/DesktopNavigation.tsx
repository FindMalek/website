import clsx from "clsx";
import Link from "next/link";

import { usePathname } from "next/navigation";

import { NavItemProps, DesktopNavigationProps } from "@/lib/types";

function NavItem({ href, children }: NavItemProps) {
  let isActive = usePathname() === href;

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          "relative block px-3 py-2 transition",
          isActive
            ? "text-cyan-900 dark:text-cyan-400"
            : "hover:text-cyan-900 dark:hover:text-cyan-400"
        )}>
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 dark:from-cyan-400/0 dark:via-cyan-400/40 dark:to-cyan-400/0" />
        )}
      </Link>
    </li>
  );
}

export default function DesktopNavigation(props: DesktopNavigationProps) {
  return (
    <nav {...props}>
      <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <NavItem href="/about">About</NavItem>
        <NavItem href="/projects">Projects</NavItem>
        <NavItem href="/contact">Contact</NavItem>
      </ul>
    </nav>
  );
}
