import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { User } from "lucide-react";
import { TbBrandNextjs } from "react-icons/tb";

const findmalek = {
	name: "FindMalek",
	description:
		"My personal website, where I offer my services, showcase my work and share my knowledge.",
	icon: User,
	details: {
		about:
			"FindMalek is very modern and clean, prototyped with Figma and build with NextJS, ReactJS and TailwindCSS. I created this website to offer my services, showcase my work and share my knowledge.",
		tech: [
			{
				name: "NextJS",
				icon: TbBrandNextjs,
			},
			{
				name: "ReactJS",
				icon: BiLogoReact,
			},
			{
				name: "TailwindCSS",
				icon: BiLogoTailwindCss,
			},
			{
				name: "NodeJS",
				icon: BiLogoNodejs,
			},
		],
		href: "https://www.findmalek.com/",
	},
	accordion: [
		{
			question:
				"Can you create a website like the one you created for FindMalek ?",
			answer:
				"Yes, I can create a website like the one I created for FindMalek. Please contact me for more information.",
		},
		{
			question: "Do you offer a discount for students?",
			answer:
				"Yes, I offer a 10% discount for students, with innovative idea and also offers to partner with me.",
		},
		{
			question: "How can I request a quote or get in touch with you?",
			answer:
				"It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
		},
	],
	github: {
		name: "FindMalek",
		description:
			"FindMalek Portfolio: Next.js, React, Shadcn, Tailwind. Explore my work! 💻",
		date: "Created on September 2023",
		href: "https://github.com/FindMalek/FindMalek  ",
		iconSrc:
			"https://FindMalek.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffavicon.f7227b70.ico&w=64&q=75",
	},
};

export default findmalek as ProjectType;
