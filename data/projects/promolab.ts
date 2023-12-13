import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { GiChemicalDrop } from "react-icons/gi";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";

const promolab = {
	name: "Promolab",
	description:
		"Promolab is a dynamic web solutions provider, specializing in crafting engaging websites and web applications. We blend creativity and innovation to deliver digital solutions that stand out in the online landscape.",
	icon: GiChemicalDrop,
	details: {
		about:
			"At Promolab, we're passionate about web technology and its potential to transform businesses. With a team of dedicated professionals, we strive to create digital experiences that captivate and connect. Our commitment to quality and client satisfaction drives us to deliver cutting-edge solutions tailored to your unique needs. Let us be your partner in the digital journey.",
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
		href: "https://promolab.vercel.app/",
	},
	accordion: [
		{
			question:
				"Can you create an e-commerce website like the one you created for Promolab?",
			answer:
				"Yes, I have experience in designing and developing e-commerce websites, and I can create one tailored to Promolab needs. Please provide details about your products, preferred features, and any specific design elements you have in mind so we can get started on your project.",
		},
		{
			question:
				"How long does it typically take to build an e-commerce website?",
			answer:
				"The timeline for developing an e-commerce website can vary depending on the complexity of your shop and the number of products you plan to sell. Generally, it can take several weeks to a few months. To provide a more accurate estimate, please share your project details, and we can discuss the timeline in more detail.",
		},
		{
			question: "How can I request a quote or get in touch with you?",
			answer:
				"It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details, including a brief description of your project or any questions you have. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
		},
	],
	github: {
		name: "Promolab",
		description:
			"Promolab is a dynamic web solutions provider, specializing in crafting engaging websites and web applications. We blend creativity and innovation to deliver digital solutions that stand out in the online landscape.",
		date: "Created on July 2023",
		href: "https://github.com/FindMalek/Promolab",
		iconSrc:
			"https://promolab.vercel.app/_next/image?url=%2Fpromolab_logo.webp&w=256&q=75",
	},
};

export default promolab as ProjectType;
