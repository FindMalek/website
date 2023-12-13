import Link from "next/link";
import type { HorizontalContentType } from "@/types/horizental-content";

export default function HorizentalContent({
	sectionId,
	content,
}: {
	sectionId?: string;
	content: HorizontalContentType[];
}) {
	return (
		<section id={sectionId || "NULL"}>
			<ul className="mx-auto grid gap-8 py-20">
				{content.map((item) => (
					<li
						key={item.name}
						className="relative flex gap-x-6 -mt-5">
						<div className="before:absolute before:left-[9px] before:top-[0.25rem] before:h-[110%] before:w-[2px] before:bg-black dark:before:bg-white">
							<svg
								height="20"
								width="20"
								className="fill-black dark:fill-white">
								<circle
									cx="10"
									cy="10"
									r="6"
								/>
							</svg>
						</div>
						<div>
							<Link
								href={item.href}
								target={item.target}
								aria-label={item.name}
								className="flex items-center">
								<h2 className="text-md font-semibold text-black hover:text-black/80 dark:text-white dark:hover:text-white/80 hover:text-cyan-600 hover:underline hover:underline-offset-1">
									{item.name}
								</h2>

								{item.sub.is && (
									<p className="hidden md:block ml-2 text-xs font-light text-gray-600 dark:text-gray-400">
										{item.sub.name}
									</p>
								)}

								<div className="ml-auto flex items-center">
									<p className="hidden md:block text-sm font-medium ml-1 text-black dark:text-white underline underline-offset-1">
										{item.linkText}
									</p>
									<item.icon className="ml-1 w-5 h-5 text-black dark:text-white" />
								</div>
							</Link>

							<p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-400">
								{item.description}
							</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
