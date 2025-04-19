import { Avatar, AvatarContainer } from "@/components/shared/avatar"

interface HeaderAvatarProps {
  isHomePage: boolean
  avatarRef: React.RefObject<HTMLDivElement | null>
}

export function HeaderAvatar({ isHomePage, avatarRef }: HeaderAvatarProps) {
  if (!isHomePage) {
    return (
      <div className="flex items-center pl-2 pt-7 sm:pl-4 sm:pt-4">
        <Avatar
          className="block origin-left"
          style={{ transform: "var(--avatar-image-transform)" }}
        />
      </div>
    )
  }

  return (
    <>
      <div ref={avatarRef} className="order-last" />
      <div className="sticky top-0 order-last mx-auto w-full px-2 pt-3 sm:max-w-lg sm:px-3 md:max-w-2xl xl:max-w-3xl">
        <div className="relative">
          <AvatarContainer
            className="origin-left transition-opacity"
            style={{
              opacity: "var(--avatar-border-opacity, 0)",
              transform: "var(--avatar-border-transform)",
            }}
          />
          <Avatar
            large
            className="block origin-left"
            style={{
              transform: "var(--avatar-image-transform)",
            }}
          />
        </div>
      </div>
    </>
  )
}
