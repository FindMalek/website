import { ProjectType } from "@/types/project";
import { SiAdobeillustrator } from "react-icons/si";
import { MdProductionQuantityLimits } from "react-icons/md";

import { VitalBurstIcon } from "@/components/overall/Icons";

const vitalBurst = {
	name: "Vital Burst",
	description:
		"Vital Burst is an E-Commerce website for Supplements and Vitamins. I was responsible for the whole website development. It is build with Supliful.",
	icon: VitalBurstIcon,
	details: {
		about:
			"At Vital Burst, we offer the best supplement for the Bodybuilding Community, with a wide range of products from the best brands. We are committed to providing you with the best products and services, so you can achieve your goals and live a healthy life.",
		tech: [
			{
				name: "Supliful",
				icon: MdProductionQuantityLimits,
			},
			{
				name: "Adobe Illustrator",
				icon: SiAdobeillustrator,
			},
		],
		href: "https://vitalburst.shopfront.live/",
	},
	accordion: [
		{
			question: "What kind of products do you sell?",
			answer:
				"We sell supplements and vitamins for the Bodybuilding Community.",
		},
		{
			question: "How can I request a quote or get in touch with you?",
			answer:
				"It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details, including a brief description of your project or any questions you have. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
		},
		{
			question: "I need help with my order. Who can I contact?",
			answer:
				"You can contact us by filling the form on the 'Contact' page on our website.",
		},
	],
};

export default vitalBurst as ProjectType;
