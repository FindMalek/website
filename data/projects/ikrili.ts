import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";

import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";
import { BsFillHouseAddFill } from "react-icons/bs";

const ikrili = {
	name: "Ikrili",
	description:
		"Ikrili is a platform made for Students to look for a house to rent. It is build with NextJS, ReactJS, TailwindCSS and Supabase.",
	icon: BsFillHouseAddFill,
	details: {
		about:
			"At Ikrili, we offer the comfort of finding a house to rent in a few clicks. We are committed to providing you with the best products and services, so you can achieve your goals and live a healthy life.",
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
				name: "Supabase",
				icon: RiSupabaseFill,
			},
			{
				name: "NodeJS",
				icon: BiLogoNodejs,
			},
		],
		href: "https://www.figma.com/file/BkhNVRUYwEDwD4bk4WBWQU/Ikrili?type=design&node-id=0%3A1&mode=design&t=BLDRwk0UQp1Cwb6U-1",
	},
	accordion: [
		{
			question: "Do you create Mobile Applications?",
			answer:
				"Currently, I'm partner with a Mobile Developer Agency called 'Chinka Studio'. We can create a Mobile Application for you. Please contact me for more information.",
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
		name: "Ikrili",
		description: "Find the Perfect Student Accommodation Near Your University.",
		date: "Created on August 2023",
		href: "https://github.com/FindMalek/Ikrili",
		iconSrc:
			"https://ikrili-fawn.vercel.app/_next/image?url=%2Ffavicon.ico&w=48&q=75",
	},
};

export default ikrili as ProjectType;
