import { ProjectType } from "@/types/project";
import {
	BiLogoPython,

	BiLogoDiscordAlt,
} from "react-icons/bi";
import { AiFillYoutube } from "react-icons/ai";

const lazytube = {
	name: "LazyTube",
	description:
		"LazyTube is a Discord Bot, notifies you when your favorite Youtube Creators upload a new video.",
	icon: AiFillYoutube,
	details: {
		about:
			"LazyTube is a project to help you track your YouTube Watch Time. It is build with Python, Youtube API and Discord API. This Discord Bot would notify you in your Discord Server everytime when one of your Youtube Creators upload a new video and offer you to download it or put it on Watch later.",
		tech: [
			{
				name: "Python",
				icon: BiLogoPython,
			},
			{
				name: "Youtube API",
				icon: AiFillYoutube,
			},
			{
				name: "Discord API",
				icon: BiLogoDiscordAlt,
			},
		],
	},
	accordion: [
		{
			question: "Can I use LazyTube on my Discord Server ?",
			answer:
				"Yes, you can use LazyTube on your Discord Server. You can invite it from the link below.",
		},
		{
			question: "Can you create other Discord Bots that automates tasks ?",
			answer:
				"Yes, I can create other Discord Bots that automates tasks. Please contact me for more information.",
		},
		{
			question: "How can I request a quote or get in touch with you?",
			answer:
				"It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details, including a brief description of your project or any questions you have. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
		},
	],
	github: {
		name: "LazyTube",
		iconSrc: "https://github.com/youtube.png",
		description:
			"LazyTube is a Discord Bot, notifies you when your favorite Youtube Creators upload a new video.",
		date: "Created on September 2020",
		href: "https://github.com/FindMalek/LazyTube",
	},
};

export default lazytube as ProjectType;
