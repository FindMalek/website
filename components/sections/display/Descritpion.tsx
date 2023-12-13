import Link from "next/link";

export default function Description() {
	return (
		<p className="text-base font-light pt-6 text-left dark:text-white">
			Contact me for top-notch development services or schedule a{" "}
			<Link
				target="_blank"
				href="https://book.morgen.so/malekgarahellalbus44"
				className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1">
				MEETING
			</Link>{" "}
			today.
		</p>
	);
}
