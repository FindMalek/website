import { Popover } from "@headlessui/react";
import { IconType } from "react-icons";
import { StoreApi } from "zustand";

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
  };
  description: string;
  linkText: string;
  href: string;
  target: string;
  icon: IconType;
};

export type Section = {
  id: string;
  headingRef: React.RefObject<HTMLElement>;
  offsetRem: number;
};

export type State = {
  sections: Section[];
  visibleSections: Section[];
  setVisibleSections: (visibleSections: Section[]) => void;
  registerHeading: (args: { id: string; ref: any; offsetRem: number }) => void;
};

export type Store = StoreApi<{
  sections: Section[];
  visibleSections: Section[];
  setVisibleSections: (visibleSections: Section[]) => void;
  registerHeading: (args: { id: string; ref: any; offsetRem: number }) => void;
}>;

export type RegisterHeadingType = (args: {
  id: string;
  ref: React.RefObject<any>;
  offsetRem: number;
}) => void;

export type projects = {
  href: string;
  name: string;
  description: string;
  icon: IconType;
};
