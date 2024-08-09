import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";
import { LuZap } from "react-icons/lu";

const stelify = {
  name: "Stelify",
  description:
    "Stelify is a project dedicated to Tunisians, showcasing all their analytics and fostering a better community for artists. Built with a focus on UI and using FindPlate as the starting point.",
  icon: LuZap,
  details: {
    about:
      "Stelify is a project designed to showcase analytics and create a better community for Tunisian artists. With a strong focus on UI, Stelify leverages the FindPlate starter kit to provide a comprehensive solution. It includes features like secure authentication, insightful analytics, email integration, ready components, database management, global reach, blog pages, SEO optimization, dark mode, and more. Stelify is built with NextJS, ReactJS, TailwindCSS, Supabase, and NodeJS.",
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
    href: "https://stelify.vercel.app/",
  },
  accordion: [
    {
      question: "What are the main features of Stelify?",
      answer:
        "Stelify offers secure authentication, insightful analytics, email integration, ready components, database management, global reach, blog pages, SEO optimization, dark mode, and more. It is built with a strong focus on UI and uses the FindPlate starter kit.",
    },
    {
      question: "What is the goal of Stelify?",
      answer:
        "Stelify is designed to showcase analytics and create a better community for Tunisian artists.",
    },
    {
      question: "I have a question about Stelify. How can I get in touch?",
      answer:
        "You can reach out to us by sending an email to 'hi@findmalek.com' or head to the contact page",
    },
  ],
};

export default stelify as ProjectType;
