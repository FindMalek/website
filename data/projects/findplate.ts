import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";
import { FaAnglesRight } from "react-icons/fa6";

const findplate = {
  name: "FindPlate",
  description:
    "Speed up your project setup by 65% with FindPlate, your complete Next.js starter kit for SaaS, AI tools, and more. Turn your ideas into revenue quickly.",
  icon: FaAnglesRight,
  details: {
    about:
      "FindPlate is a comprehensive Next.js starter kit designed to speed up your project setup by 65%. It includes secure authentication, insightful analytics, email integration, ready components, database management, global reach, blog pages, SEO optimization, dark mode, and more. FindPlate is built with NextJS, ReactJS, TailwindCSS, Supabase, and NodeJS.",
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
    href: "https://plate.findmalek.com/",
  },
  accordion: [
    {
      question:
        "What are the main features of FindPlate?",
      answer:
        "FindPlate offers secure authentication, insightful analytics, email integration, ready components, database management, global reach, blog pages, SEO optimization, dark mode, and more.",
    },
    {
      question: "Is FindPlate the right choice for my project?",
      answer:
        "FindPlate is designed to speed up your project setup by 65%. If you are looking to turn your ideas into revenue quickly, FindPlate is the right choice for your project.",
    },
    {
      question: "How can I contribute to FindPlate?",
      answer:
        "You can contribute to FindPlate by visiting our GitHub repository and following the contribution guidelines provided there.",
    },
  ],
};

export default findplate as ProjectType;
