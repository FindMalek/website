import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import avatarImage from "@/images/favicon.ico";

import { AvatarContainerType } from "@/types/avatar-container";

export function AvatarContainer({ className, ...props }: AvatarContainerType) {
	return (
		<div
			className={clsx(
				className,
				"h-10 w-10 rounded-full bg-cyan-400/40 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-cyan-600/80 dark:ring-black/10",
			)}
			{...props}
		/>
	);
}

export function Avatar({
	large = false,
	className,
	style,
}: {
	large?: boolean;
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<Link
			href="/"
			aria-label="Home"
			className={clsx(className, "pointer-events-auto")}
			style={style}>
			<Image
				src={avatarImage}
				alt="Malek Gara-Hellal avatar, a black and white picture of his face."
				sizes={large ? "4rem" : "2.25rem"}
				className={clsx(
					"rounded-full bg-cyan-800 object-cover dark:bg-cyan-400",
					large ? "h-16 w-16" : "h-9 w-9",
				)}
				priority
			/>
		</Link>
	);
}
