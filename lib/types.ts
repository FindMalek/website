import { Popover } from "@headlessui/react";

export type NavItemProps = {
  href: string;
  children: React.ReactNode;
};

export type MobileNavigationProps = React.ComponentProps<typeof Popover>;

export type DesktopNavigationProps = React.ComponentPropsWithoutRef<"nav">;

export type clampProps = {
  number: number;
  a: number;
  b: number;
};

export type AvatarContainerProps = React.ComponentProps<"div">;
