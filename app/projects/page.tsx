import type { Metadata } from "next";

import Header from "@/components/sections/display/Header";
import Footer from "@/components/sections/display/Footer";

import { GridProjects } from "@/components/sections/projects/GridProjects";

export const metadata: Metadata = {
	title: "Projects | FindMalek",
};

export default function Projects() {
	return (
		<>
			<Header name="Projects." />

			<GridProjects />

			<Footer
				name="Convinced yet to contact me ?"
				href="/contact"
			/>
		</>
	);
}
