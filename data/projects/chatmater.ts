import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";
import { FaRobot } from "react-icons/fa6";

const chatmater = {
  name: "Chatmater",
  description:
    "Designed to automate and personalize messaging, this web application empowers creators to maintain consistent, meaningful connections with their fans without the manual overhead.",
  icon: FaRobot,
  details: {
    about:
      "Chatmater is a web application that automates and personalizes messaging. It empowers creators to maintain consistent, meaningful connections with their fans without the manual overhead. Chatmater is built with NextJS, ReactJS, TailwindCSS, Supabase, and NodeJS.",
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
    href: "https://chatmater.vercel.app/login",
  },
  accordion: [
    {
      question:
        "I have an idea for a SaaS Web App. Can you assist in its development?",
      answer:
        "Absolutely! I specialize in developing SaaS Web Apps. To discuss your idea in detail and explore how I can assist, please reach out to me via the contact details provided on my website.",
    },
    {
      question: "Do you plan to continue working on Chatmater?",
      answer:
        "Yes, I plan to continue working on Chatmater. I have a lot of ideas to improve it. It's open source, so you can contribute to it.",
    },
    {
      question: "What is the process for requesting a quote or contacting you?",
      answer:
        "Getting a quote or reaching out is straightforward. Please head to the 'Contact' section on our website and fill out the available form. Provide some initial details about your project or inquiries. I will respond swiftly with the necessary information and create a tailored quote that aligns with your specific needs.",
    },
  ],
  github: {
    name: "Chatmater",
    description:
      "Designed to automate and personalize messaging, this web application empowers creators to maintain consistent, meaningful connections with their fans without the manual overhead.",
    date: "Created on February 2024",
    href: "https://github.com/FindMalek/Chatmater",
    iconSrc: "https://chatmater.vercel.app/favicon.ico",
  },
};

export default chatmater as ProjectType;
