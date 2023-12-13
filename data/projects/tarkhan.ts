import { ProjectType } from "@/types/project";

import { BiLogoShopify } from "react-icons/bi";
import { SiJson } from "react-icons/si";
import { PiShirtFoldedFill } from "react-icons/pi";

const tarkhan = {
	name: "Tarkhan",
	description:
		"Tarkhan is your destination for timeless elegance. Discover our curated collection of bespoke clothing and accessories designed to elevate your style. With a focus on quality craftsmanship and personalized tailoring, we create pieces that reflect your individuality and make a lasting impression.",
	icon: PiShirtFoldedFill,
	details: {
		about:
			"At Tarkhan, we believe that clothing is more than just fabric and threads; it's an expression of your personality. Our journey began with a passion for redefining classic styles and making them accessible to all. Today, we continue to blend tradition with modernity, offering a range of clothing that suits your unique taste. We take pride in our commitment to quality, craftsmanship, and customer satisfaction. Welcome to Tarkhan, where elegance meets individuality.",
		tech: [
			{
				name: "Shopify",
				icon: BiLogoShopify,
			},
			{
				name: "Liquid",
				icon: SiJson,
			},
		],
		href: "https://tarkhan.fr/",
	},
	accordion: [
		{
			question: "Can you help me with my Shopify store?",
			answer:
				"Yes, I have experience in Shopify and Liquid. I can help you with your Shopify store. Please contact me for more information.",
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
		name: "Tarkhan",
		iconSrc:
			"https://tarkhan.fr/cdn/shop/files/TARKHAN_LOGO_OK_1-removebg-preview.png?v=1696584170&width=500",
		description:
			"Découvrez nos chemises inédites et uniques, conçues pour s'adapter à toutes les morphologies.",
		date: "Created on August 2023",
		href: "https://github.com/FindMalek/Tarkhan",
	},
};

export default tarkhan as ProjectType;
