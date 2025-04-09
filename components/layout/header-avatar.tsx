import { Avatar, AvatarContainer } from "@/components/shared/avatar"

interface HeaderAvatarProps {
  isHomePage: boolean
  avatarRef: React.RefObject<HTMLDivElement | null>
}

export function HeaderAvatar({ isHomePage, avatarRef }: HeaderAvatarProps) {
  if (!isHomePage) {
    return (
      <div>
        <AvatarContainer>
          <Avatar />
        </AvatarContainer>
      </div>
    )
  }

  return (
    <>
      <div
        ref={avatarRef}
        className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
      />
      <div className="sticky top-0 order-last mx-auto -mb-3 w-full px-2 pt-3 sm:max-w-lg sm:px-3 md:max-w-2xl xl:max-w-3xl">
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
            style={{ transform: "var(--avatar-image-transform)" }}
          />
        </div>
      </div>
    </>
  )
}
