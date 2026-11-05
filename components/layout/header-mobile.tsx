import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Popover, Transition, useClose } from "@headlessui/react"

import { MobileNavigationType, NavItemType } from "@/types"

import { NAV_ITEMS } from "@/config/consts"
import { scrollToAnchorSection } from "@/lib/utils"

import { ChevronDownIcon, CloseIcon } from "@/components/dither/pixel-icon"
import { ModeToggle } from "@/components/shared/mode-toggle"

function MobileNavItem({ href, children }: NavItemType) {
  const pathname = usePathname()
  const close = useClose()

  return (
    <li>
      <Popover.Button
        as={Link}
        href={href}
        className="dither-hover block px-2 py-2 lowercase"
        onClick={(e: React.MouseEvent) => {
          close()
          if (scrollToAnchorSection(href, pathname)) e.preventDefault()
        }}
      >
        {children}
      </Popover.Button>
    </li>
  )
}

export function HeaderMobile(props: MobileNavigationType) {
  return (
    <Popover {...props}>
      <Popover.Button className="border-foreground/25 bg-background/85 text-foreground dither-hover flex items-center rounded-none border px-3 py-1.5 font-mono text-sm lowercase">
        menu
        <ChevronDownIcon className="text-muted-foreground ml-3" />
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="bg-background/80 fixed inset-0 z-50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="border-foreground/25 bg-background fixed inset-x-4 top-8 z-50 origin-top rounded-none border p-6 font-mono sm:left-auto sm:right-4 sm:w-80"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                <CloseIcon className="text-muted-foreground size-5" />
              </Popover.Button>
              <h2 className="text-muted-foreground text-sm lowercase">navigation</h2>
            </div>
            <nav className="mt-6">
              <ul className="divide-foreground/10 -my-2 divide-y text-base">
                {Object.values(NAV_ITEMS).map((item) => (
                  <MobileNavItem key={item.path} href={item.path}>
                    {item.name}
                  </MobileNavItem>
                ))}
              </ul>
            </nav>
            <div className="border-foreground/10 mt-6 flex justify-end border-t pt-4">
              <ModeToggle />
            </div>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}
