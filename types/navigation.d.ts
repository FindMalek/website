import { Popover } from "@headlessui/react";

export type NavItemType = {
	href: string;
	children: React.ReactNode;
};

export type MobileNavigationType = React.ComponentProps<typeof Popover>;

export type DesktopNavigationType = React.ComponentPropsWithoutRef<"nav">;
