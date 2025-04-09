"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useHeaderAnimation } from "@/hooks/use-header-animation"

import { HeaderAvatar } from "@/components/layout/header-avatar"
import { HeaderDesktop } from "@/components/layout/header-desktop"
import { HeaderMobile } from "@/components/layout/header-mobile"

export function Header() {
  const isHomePage = usePathname() === "/"
  const { headerRef, avatarRef } = useHeaderAnimation(isHomePage)

  return (
    <>
      <header
        className={cn("pointer-events-none relative z-50 flex flex-col")}
        style={{
          height: "var(--header-height)",
          marginBottom: "var(--header-mb)",
        }}
      >
        {isHomePage && (
          <HeaderAvatar isHomePage={isHomePage} avatarRef={avatarRef} />
        )}
        <div
          ref={headerRef}
          className={cn(
            "sticky top-0 z-10 mx-auto h-14 w-full pt-4",
            "sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
          )}
        >
          <div
            className="w-full"
            style={{
              position: "fixed",
              top: "var(--header-top, 1.5rem)",
            }}
          >
            <div
              className={cn(
                "mx-auto w-full px-4",
                "sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="pointer-events-auto">
                  {!isHomePage && (
                    <HeaderAvatar
                      isHomePage={isHomePage}
                      avatarRef={avatarRef}
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "pointer-events-auto ml-auto",
                    "pr-1 pt-6 sm:pr-2 md:pr-3 lg:pr-4"
                  )}
                >
                  <nav className="flex">
                    <HeaderMobile className="md:hidden" />
                    <HeaderDesktop className="hidden md:block" />
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {isHomePage && <div style={{ height: "var(--content-offset)" }} />}
    </>
  )
}
