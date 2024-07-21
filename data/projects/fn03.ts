import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { TbBrandNextjs } from "react-icons/tb";
import { FaGlobe } from "react-icons/fa";

const fn03 = {
  name: "Function03 Labs",
  description: "The Function03 website",
  icon: FaGlobe,
  details: {
    about:
      "Function03 Labs is a website that showcases the work of Function03. It is built with NextJS, ReactJS, TailwindCSS, and NodeJS.",
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
    href: "https://website-function03.vercel.app/",
  },
  accordion: [
    {
      question:
        "Can you create a website like the one you created for Function03 ?",
      answer:
        "Yes, I can create a website like the one I created for Function03. Please contact me for more information.",
    },
    {
      question: "Do you offer a discount for students?",
      answer:
        "Yes, I offer a 10% discount for students, with innovative idea and also offers to partner with me.",
    },
    {
      question: "How can I request a quote or get in touch with you?",
      answer:
        "It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
    },
  ],
  github: {
    name: "fn03",
    description: "The Function03 website 🏠",
    date: "Created on April 2024",
    href: "https://github.com/FindMalek/fn03  ",
    iconSrc: "https://website-function03.vercel.app/favicon.ico",
  },
};

export default fn03 as ProjectType;
