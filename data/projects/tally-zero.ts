import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { TbBrandNextjs } from "react-icons/tb";
import { FaRobot } from "react-icons/fa6";

const tallyZero = {
  name: "Tally Zero",
  description:
    "Tally Zero is a decentralized governance platform that offers a range of features to enable secure, transparent, and decentralized voting on blockchain proposals.",
  icon: FaRobot,
  details: {
    about:
      "Tally Zero is a decentralized governance platform that offers a range of features to enable secure, transparent, and decentralized voting on blockchain proposals. It includes decentralized voting, wallet integration, IPFS deployment, proposal browsing and voting, cross-chain support, and is open source for community-driven development and improvement.",
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
    href: "https://tally-zero.preview.tally.xyz",
  },
  accordion: [
    {
      question:
        "What are the main features of Tally Zero?",
      answer:
        "Tally Zero offers decentralized voting, wallet integration, IPFS deployment, proposal browsing and voting, cross-chain support, and is open source for community-driven development and improvement.",
    },
    {
      question: "Is Tally Zero open source?",
      answer:
        "Yes, Tally Zero is open source. This allows for community-driven development and improvement.",
    },
    {
      question: "How can I contribute to Tally Zero?",
      answer:
        "You can contribute to Tally Zero by visiting our GitHub repository and following the contribution guidelines provided there.",
    },
  ],
  github: {
    name: "Tally Zero",
    description:
      "Tally Zero is a decentralized governance platform that offers a range of features to enable secure, transparent, and decentralized voting on blockchain proposals.",
    date: "Created on March 2023",
    href: "https://github.com/findmalek/tally-zero",
    iconSrc: "https://tally-zero.preview.tally.xyz/favicon/favicon.ico",
  },
};

export default tallyZero as ProjectType;
