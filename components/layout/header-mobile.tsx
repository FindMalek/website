import { Fragment } from "react"
import Link from "next/link"
import { Popover, Transition } from "@headlessui/react"

import { MobileNavigationType, NavItemType } from "@/types"

import { NAV_ITEMS } from "@/config/consts"

import { Icons } from "@/components/shared/icons"

function MobileNavItem({ href, children }: NavItemType) {
  return (
    <li>
      <Popover.Button as={Link} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  )
}

export function HeaderMobile(props: MobileNavigationType) {
  return (
    <Popover {...props}>
      <Popover.Button className="group flex items-center rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-zinc-950 shadow-lg shadow-zinc-900/15 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-900/70 dark:text-zinc-200 dark:shadow-zinc-800/5 dark:ring-white/10 dark:hover:ring-white/20">
        Menu
        <Icons.chevronDown className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
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
          <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
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
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 sm:left-auto sm:right-4 sm:w-80 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                <Icons.close className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
              </Popover.Button>
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Navigation
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                {Object.values(NAV_ITEMS).map((item) => (
                  <MobileNavItem key={item.path} href={item.path}>
                    {item.name}
                  </MobileNavItem>
                ))}
              </ul>
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}
