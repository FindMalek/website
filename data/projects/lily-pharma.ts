import { ProjectType } from "@/types/project";

import { BiLogoShopify } from "react-icons/bi";
import { SiJson } from "react-icons/si";
import { ShoppingBag } from "lucide-react";

const lilyPharma = {
	name: "Lily Pharma",
	description:
		"Expertise en parapharmacie et beauté. Produits de qualité, conseils personnalisés.",
	icon: ShoppingBag,
	details: {
		about:
			"Lily Pharma is an E-Commerce Website. I was responsible for the whole website development. It is build with Shopify and Liquid.",
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
		href: "https://lilypharma.myshopify.com/",
	},
	accordion: [
		{
			question:
				"Can you create an e-commerce website like the one you created for Lily Pharma?",
			answer:
				"Yes, I have experience in designing and developing e-commerce websites, and I can create one tailored to Lily Pharma's needs. Please provide details about your products, preferred features, and any specific design elements you have in mind so we can get started on your project.",
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
};

export default lilyPharma as ProjectType;
