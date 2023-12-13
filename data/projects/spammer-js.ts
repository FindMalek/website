import { ProjectType } from "@/types/project";

import { SpammerJS } from "@/components/overall/Icons";
import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { TbBrandNextjs } from "react-icons/tb";

const spammerJs = {
	name: "SpammerJS",
	description:
		"Who doesn't like spamming their friends? SpammerJS is the best email spammer.",
	icon: SpammerJS,
	details: {
		about:
			"SpammerJS is a tool that allows you to spam your friends with emails. It is build with NextJS, ReactJS and TailwindCSS. It only works when your friend uses EmailJS and you have their EmailJS Service ID.",
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
		href: "https://spammer-js.vercel.app/",
	},
	accordion: [
		{
			question: "Can you create a tool like SpammerJS?",
			answer:
				"Yes, I have experience in designing and developing tools, and I can create one tailored to your needs. Please provide details about your tool, preferred features, and any specific design elements you have in mind so we can get started on your project.",
		},
		{
			question: "How long does it typically take to build a tool?",
			answer:
				"The timeline for developing a tool can vary depending on the complexity of your tool and the number of features you plan to have. Generally, it can take several weeks to a few months. To provide a more accurate estimate, please share your project details, and we can discuss the timeline in more detail.",
		},
		{
			question: "What is the process for requesting a quote or contacting you?",
			answer:
				"Getting a quote or reaching out is straightforward. Please head to the 'Contact' section on our website and fill out the available form. Provide some initial details about your project or inquiries. I will respond swiftly with the necessary information and create a tailored quote that aligns with your specific needs.",
		},
	],
	github: {
		name: "SpammerJS",
		description:
			"🚀 Who doesn't like spamming their friends? SpammerJS is the best email spammer.",
		date: "Created on November 2023",
		href: "https://github.com/FindMalek/SpammerJS",
		iconSrc:
			"https://raw.githubusercontent.com/github/explore/3c66f1237835e0b877190fbea528d0ebece7bccf/topics/vercel/vercel.png",
	},
};

export default spammerJs as ProjectType;
