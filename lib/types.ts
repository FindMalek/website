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

type Tech = {
  name: string;
  icon: IconType;
};

type Display = {
  type: string; // Image or Gif
  src: string;
  alt: string;
  height: number;
  width: number;
}

export type Project = {
  name: string;
  description: string; // Short description
  icon: IconType;
  display?: Display; // Display href: A local file. Could be an Image or a Gif
  details: {
    about: string; // Long description
    tech: Tech[]; // Tech stack
    duration: number; // Duration of the project in weeks
    delivary: string; // Delivered : Month, Year
    href?: string; // Link to the hosted project (Vercel or Domain Name)
    github?: string; // Link to the github repo
  };
};
