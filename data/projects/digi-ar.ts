import { ProjectType } from "@/types/project";
import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";

import { GrStatusUnknownSmall } from "react-icons/gr";
import { TbBrandNextjs } from "react-icons/tb";

const digiAr = {
	name: "Digital Army",
	description:
		"Online portfolio of Mahmoud Beznaiguia, a digital marketer skilled in SEO, social media, email marketing, and more. View examples of his work and contact him to help your business succeed online.",
	icon: GrStatusUnknownSmall,
	/**
    display: {
      type: "gif",
      src: "/assets/gif/digi-ar.gif",
      alt: "Digital Army Display GIF for the Website.",
      height: 5 + 5,
      width: 500,
    },
    */
	details: {
		about:
			"Digital Army is a digital marketing agency based in Tunisia. It was founded by Mahmoud Beznaiguia, a digital marketer skilled in SEO, social media, email marketing, and more. View examples of his work and contact him to help your business succeed online.",
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
		href: "https://www.digital-army.org/",
	},
	accordion: [
		{
			question:
				"Can you create a website like the one you created for Digital Army?",
			answer:
				"Absolutely! I specialize in creating custom websites tailored to your unique needs and preferences. Feel free to share your requirements, and we can discuss the details to ensure your website matches your vision.",
		},
		{
			question: "How long does it take to develop a website?",
			answer:
				"The timeline for website development depends on various factors, such as the complexity of the project, the number of features required, and the availability of content. Typically, a simple website can be completed within a few weeks, while more complex projects may take a few months. I'll provide you with a detailed project timeline during our initial consultation.",
		},
		{
			question: "How can I request a quote or get in touch with you?",
			answer:
				"It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details, including a brief description of your project or any questions you have. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
		},
	],
	github: {
		name: "Digi-Ar",
		description: "Digital Army, a digital marketing agency based in Tunisia.",
		date: "Created on Febraury 2023",
		href: "https://github.com/FindMalek/Digi.ar",
		iconSrc:
			"https://digi-ar.vercel.app/_next/image?url=%2Flogos%2Flogo-black.webp&w=48&q=75",
	},
};

export default digiAr as ProjectType;
