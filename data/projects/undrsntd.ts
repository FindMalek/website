import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { GrStatusUnknownSmall } from "react-icons/gr";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";

const undrsntd = {
	name: "Undrstnd",
	description:
		"Undrstnd is a SaaS web app; Upload your documents and chat with them.",
	icon: GrStatusUnknownSmall,
	details: {
		about:
			"Undrstnd is a SaaS Web Application, made for Students to upload documents and chat with them in an instance.",
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
		href: "https://undrstnd.vercel.app/",
	},
	accordion: [
		{
			question:
				"I have an idea for a SaaS Web App. Can you assist in its development?",
			answer:
				"Absolutely! I specialize in developing SaaS Web Apps. To discuss your idea in detail and explore how I can assist, please reach out to me via the contact details provided on my website.",
		},
		{
			question:
				"Are Undrstnd services complimentary for educators and students?",
			answer:
				"Indeed, Undrstnd services are available free of charge for educators and students. Simply sign in using your Github account. We'll verify your eligibility through the Github Student Pack, ensuring seamless access to our services.",
		},
		{
			question: "What is the process for requesting a quote or contacting you?",
			answer:
				"Getting a quote or reaching out is straightforward. Please head to the 'Contact' section on our website and fill out the available form. Provide some initial details about your project or inquiries. I will respond swiftly with the necessary information and create a tailored quote that aligns with your specific needs.",
		},
	],
	github: {
		name: "Undrstnd",
		description:
			"Undrstnd: SaaS web app with TypeScript, React, Node.js. Auth, Stripe plans, PDF viewer, real-time API, clean UI, drag & drop, tRPC, LangChain, PineCone, Prisma & more!",
		date: "Created on October 2023",
		href: "https://github.com/FindMalek/undrstnd",
		iconSrc: "https://undrstnd.vercel.app/images/logos/Clean.svg",
	},
};

export default undrsntd as ProjectType;
