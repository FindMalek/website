import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss } from "react-icons/bi";
import { SiPlanetscale } from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";

import { AiFillRedditCircle, AiFillYoutube } from "react-icons/ai";

const breadit = {
	name: "Breadit",
	description: "A Reddit Clone made with NextJS, ReactJS and TailwindCSS.",
	icon: AiFillRedditCircle,
	details: {
		about:
			"Breadit is a Reddit Clone. It is build with NextJS, ReactJS and TailwindCSS. I watch Josh course on Youtube to create this project.",
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
				name: "PlanetScale",
				icon: SiPlanetscale,
			},
		],
		href: "https://breadit-findmalek.vercel.app/",
	},
	accordion: [
		{
			question: "What did you learn from this project?",
			answer:
				"I learned how to create a Reddit Clone with NextJS, ReactJS and TailwindCSS.",
		},
		{
			question: "Do you offer a discount for students?",
			answer:
				"Yes, I offer a 10% discount for students, with innovative idea and also offers to partner with me.",
		},
		{
			question: "How can I request a quote or get in touch with you?",
			answer:
				"It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details, including a brief description of your project or any questions you have. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
		},
	],
	github: {
		name: "Breadit",
		iconSrc: "https://github.com/reddit.png",
		description: "A Reddit Clone made with NextJS, ReactJS and TailwindCSS.",
		date: "Created on June 2023",
		href: "https://github.com/FindMalek/Breadit",
	},
};

export default breadit as ProjectType;
