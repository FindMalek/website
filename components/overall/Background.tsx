"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { purplePurse } from "@/data/fonts";

export default function Background() {
	const pageName = usePathname();
	const [name, setName] = useState("");

	useEffect(() => {
		if (pageName === "/") {
			setName("FindMalek.");
		} else if (pageName === "/about") {
			setName("About Me.");
		} else if (pageName === "/projects") {
			setName("Projects.");
		} else if (pageName === "/contact") {
			setName("Contact Me.");
		} else {
			setName("404 Not Found.");
		}
	}, [name, pageName]);

	return (
		<div className="fixed -z-50 isolate overflow-hidden dark:bg-gray-950 top-0 left-0 w-full h-full">
			<svg
				className="absolute inset-0 -z-10 h-full w-full stroke-gray-900/10 dark:stroke-white/10 [mask-image:radial-gradient(110%_120%_at_top_right,white,transparent)]"
				aria-hidden="true">
				<defs>
					<pattern
						id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
						width={100}
						height={100}
						x="50%"
						y={-1}
						patternUnits="userSpaceOnUse">
						<path
							d="M.5 200V.5H200"
							fill="none"
						/>
					</pattern>
				</defs>
				<svg
					x="50%"
					y={-1}
					className="overflow-visible fill-gray-700/20">
					<path
						d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
						strokeWidth={0}
					/>
				</svg>
				<svg
					x="-50%"
					y="40%"
					className="overflow-visible fill-gray-700/20">
					<path
						d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
						strokeWidth={0}
					/>
				</svg>
				<rect
					width="100%"
					height="100%"
					strokeWidth={0}
					fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
				/>
			</svg>
			<div className={purplePurse.className}>
				<h1
					className="fixed -left-10 -bottom-24 -z-40 text-[200px] font-bold text-gray-700/10 dark:text-gray-700/10"
					style={{ userSelect: "none" }}>
					{name}
				</h1>
			</div>

			<div
				className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
				aria-hidden="true">
				<div
					className="aspect-[1108/502] w-[69.25rem] bg-gradient-to-r from-[#02ff84] to-[#00a6ff] opacity-20"
					style={{
						clipPath:
							"polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
					}}
				/>
				<div
					className="aspect-[200/45] w-[20.25rem] bg-gradient-to-r from-[#3002ff] to-[#00ffff] opacity-90"
					style={{
						clipPath:
							"polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
					}}
				/>
			</div>
		</div>
	);
}
