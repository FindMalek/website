import { Popover } from "@headlessui/react";
import { IconType } from "react-icons";

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

export type HorizontalContentProps = {
  name: string;
  sub: {
    is: boolean;
    name: string;
  }
  description: string;
  linkText: string;
  href: string;
  target: string;
  icon: IconType;
}