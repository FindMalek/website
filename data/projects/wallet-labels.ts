import { ProjectType } from "@/types/project";

import { BiLogoReact, BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";
import { RiSlashCommands2 } from "react-icons/ri";

const walletLabels = {
  name: "WalletLabels",
  description: "A web app to search Ethereum wallets by names or labels.",
  icon: RiSlashCommands2,
  details: {
    about:
      "WalletLabels is a web application that allows users to search Ethereum wallets by names or labels. It is built with NextJS, ReactJS, TailwindCSS, Postgres, and NodeJS.",
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
        name: "Postgres",
        icon: RiSupabaseFill,
      },
      {
        name: "NodeJS",
        icon: BiLogoNodejs,
      },
    ],
    href: "https://www.walletlabels.xyz/",
  },
  accordion: [
    {
      question:
        "I have an idea for a SaaS Web App. Can you assist in its development?",
      answer:
        "Absolutely! I specialize in developing SaaS Web Apps. To discuss your idea in detail and explore how I can assist, please reach out to me via the contact details provided on my website.",
    },
    {
      question: "Is WalletLabels open source?",
      answer:
        "Yes, WalletLabels is open source. You can find the source code on GitHub.",
    },
    {
      question: "What is the process for requesting a quote or contacting you?",
      answer:
        "Getting a quote or reaching out is straightforward. Please head to the 'Contact' section on our website and fill out the available form. Provide some initial details about your project or inquiries. I will respond swiftly with the necessary information and create a tailored quote that aligns with your specific needs.",
    },
  ],
  github: {
    name: "WalletLabels",
    description: "A web app to search Ethereum wallets by names or labels.",
    date: "Created on July 2024",
    href: "https://github.com/function03-labs/WalletLabels",
    iconSrc: "https://www.walletlabels.xyz/favicon.ico",
  },
};

export default walletLabels as ProjectType;
