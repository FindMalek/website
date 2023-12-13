import { ProjectType } from "@/types/project";

import { SiAdobeillustrator } from "react-icons/si";
import { GrStatusUnknownSmall } from "react-icons/gr";

const moveu = {
	name: "Move U",
	description:
		"Move U is a Fitness GYM, located in Tunisia, I manage their Social Media Accounts.",
	icon: GrStatusUnknownSmall,
	details: {
		about:
			"Move U is a Fitness GYM, I created their Graphic Design work, I create their Social Media Posts and I manage their Social Media Accounts.",
		tech: [
			{
				name: "Adobe Illustrator",
				icon: SiAdobeillustrator,
			},
		],
		href: "https://www.instagram.com/moveu.tn/",
	},
	accordion: [
		{
			question: "Can you create a website for Move U ?",
			answer:
				"Yes, I can create a website for Move U. Please contact me for more information.",
		},
		{
			question:
				"I need a Community Manager and a Graphic Designer, can you help me ?",
			answer: "Yes, I can help you. Please contact me for more information.",
		},
		{
			question: "How can I request a quote or get in touch with you?",
			answer:
				"It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
		},
	],
};

export default moveu as ProjectType;
