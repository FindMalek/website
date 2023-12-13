import Link from "next/link";
import Header from "@/components/sections/display/Header";

export default function Herosection() {
	return (
		<>
			<Header name="I'm Malek Gara-Hellal." />

			<p className="text-base font-light pt-6 text-left dark:text-white">
				The person for web development, graphic design, and creative
				entrepreneurship. I have a passion for turning lines of code into
				meaningful projects, and I'm known for my meticulous organization.
				Explore my{" "}
				<Link
					href="/projects"
					className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1">
					PROJECTS
				</Link>{" "}
				to join me on my creative journey, and discover my{" "}
				<Link
					href="/about#my-ventures"
					className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1">
					VENTURES
				</Link>{" "}
				where I bring business ideas to life.
			</p>

			<p className="text-base font-light pt-4 text-left dark:text-white">
				In my free time, I draw inspiration from Metal, Pop, and Chill music,
				and I'm an avid reader always on the lookout for fresh ideas. Explore my
				favorite{" "}
				<Link
					href="/about#my-playlists"
					className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1">
					PLAYLISTS
				</Link>{" "}
				and discover my handpicked{" "}
				<Link
					href="/about#my-reads"
					className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1">
					BOOKS
				</Link>{" "}
				for inspiration. Ready to create something extraordinary? Don't hesitate
				to{" "}
				<Link
					href="/contact"
					className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1">
					CONTACT ME
				</Link>
				.
			</p>
		</>
	);
}
