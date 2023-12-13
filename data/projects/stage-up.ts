import { ProjectType } from "@/types/project";

import { StageUpIcon } from "@/components/overall/Icons";
import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { GrStatusUnknownSmall } from "react-icons/gr";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";

const stageUp = {
	name: "StageUp",
	description:
		"StageUp is a SaaS Web Application, made for Students to find internships and hop on a call with them in an instance.",
	icon: StageUpIcon,
	details: {
		about:
			"StageUp was my Project Fin d'Année, It was a learning experience for me. Entreprises and Students can finally find comfort in a single platform. Students can find internships and hop on a call with them in an instance. Entreprises can find the best students for their internships and hire them.",
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
		href: "https://stage-up.vercel.app/",
	},
	accordion: [
		{
			question:
				"I have an idea for a SaaS Web App. Can you assist in its development?",
			answer:
				"Absolutely! I specialize in developing SaaS Web Apps. To discuss your idea in detail and explore how I can assist, please reach out to me via the contact details provided on my website.",
		},
		{
			question: "Do you plan to continue working on StageUp?",
			answer:
				"No, I don't plan to continue working on StageUp. I have other projects that I'm working on. It's open source, so you can contribute to it.",
		},
		{
			question: "What is the process for requesting a quote or contacting you?",
			answer:
				"Getting a quote or reaching out is straightforward. Please head to the 'Contact' section on our website and fill out the available form. Provide some initial details about your project or inquiries. I will respond swiftly with the necessary information and create a tailored quote that aligns with your specific needs.",
		},
	],
	github: {
		name: "StageUp",
		description:
			"🚀 La plateforme idéale pour connecter entreprises 🏢 et stagiaires 🎓.",
		date: "Created on December 2023",
		href: "https://github.com/FindMalek/StageUp",
		iconSrc:
			"https://stage-up.vercel.app/_next/image?url=%2Flogo%2Flogo-192x192.png&w=32&q=75",
	},
};

export default stageUp as ProjectType;
