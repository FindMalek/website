"use client";

import {
  BiLogoSpotify,
  BiLogoPython,
  BiLogoReact,
  BiLogoTailwindCss,
  BiLogoShopify,
  BiLogoNodejs,
  BiLogoDiscordAlt,
} from "react-icons/bi";
import {
  SiFfmpeg,
  SiJson,
  SiAdobeillustrator,
  SiPlanetscale,
} from "react-icons/si";
import { GrStatusUnknownSmall } from "react-icons/gr";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";
import { MdProductionQuantityLimits } from "react-icons/md";
import { BsFillHouseAddFill } from "react-icons/bs";
import { PiShirtFoldedFill } from "react-icons/pi";
import { AiFillRedditCircle, AiFillYoutube } from "react-icons/ai";

import { VitalBurstIcon } from "@/components/overall/Icons";

const projects = [
  {
    name: "Syncify",
    description:
      "Syncify is an open-source application. It allows you to download your Spotify Playlists, Albums and Tracks with full meta-data.",
    icon: BiLogoSpotify,
    details: {
      about:
        "Syncify was created to allow users to download their Spotify Playlists, Albums and Tracks with full meta-data. It is an open-source application that is available on Windows, macOS and Linux. It is build with Python, FFMPEG and Spotify API.",
      tech: [
        {
          name: "Python",
          icon: BiLogoPython,
        },
        {
          name: "FFMPEG",
          icon: SiFfmpeg,
        },
        {
          name: "Spotify API",
          icon: BiLogoSpotify,
        },
      ],
    },
    accordion: [
      {
        question: "How to install Syncify?",
        answer:
          "You can install Syncify from the Releases Page. First download the latest version of Syncify for your operating system. Then, follow the instructions on the README.md file.",
      },
      {
        question: "How to use Syncify?",
        answer:
          "You can use Syncify by following the instructions on the README.md file. Put the environment variables in a .env file, then run the main.py file.",
      },
      {
        question: "How to contribute to Syncify?",
        answer:
          "You can contribute to Syncify by forking the repository and creating a pull request, or by creating an issue on the Issues Page.",
      },
    ],
    github: {
      name: "Syncify",
      description:
        "Syncify is an open-source application. It allows you to download your Spotify Playlists, Albums and Tracks with full meta-data.",
      date: "Created on September 2021",
      href: "https://github.com/FindMalek/Syncify",
      iconSrc: "https://github.com/spotify.png",
    },
  },
  {
    name: "Digital Army",
    description:
      "Online portfolio of Mahmoud Beznaiguia, a digital marketer skilled in SEO, social media, email marketing, and more. View examples of his work and contact him to help your business succeed online.",
    icon: GrStatusUnknownSmall,
    display: {
      type: "gif",
      src: "/assets/gif/digi-ar.gif",
      alt: "Digital Army Display GIF for the Website.",
      height: 5 + 5,
      width: 500,
    },
    details: {
      about:
        "Digital Army is a digital marketing agency based in Tunisia. It was founded by Mahmoud Beznaiguia, a digital marketer skilled in SEO, social media, email marketing, and more. View examples of his work and contact him to help your business succeed online.",
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
      href: "https://digi-ar.vercel.app/",
    },
    accordion: [
      {
        question:
          "Can you create a website like the one you created for Digital Army?",
        answer:
          "Absolutely! I specialize in creating custom websites tailored to your unique needs and preferences. Feel free to share your requirements, and we can discuss the details to ensure your website matches your vision.",
      },
      {
        question: "How long does it take to develop a website?",
        answer:
          "The timeline for website development depends on various factors, such as the complexity of the project, the number of features required, and the availability of content. Typically, a simple website can be completed within a few weeks, while more complex projects may take a few months. I'll provide you with a detailed project timeline during our initial consultation.",
      },
      {
        question: "How can I request a quote or get in touch with you?",
        answer:
          "It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details, including a brief description of your project or any questions you have. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
      },
    ],
    github: {
      name: "Digi-Ar",
      description: "Digital Army, a digital marketing agency based in Tunisia.",
      date: "Created on Febraury 2023",
      href: "https://github.com/FindMalek/Digi.ar",
      iconSrc:
        "https://digi-ar.vercel.app/_next/image?url=%2Flogos%2Flogo-black.webp&w=48&q=75",
    },
  },
  {
    name: "Lily Pharma",
    description:
      "Expertise en parapharmacie et beauté. Produits de qualité, conseils personnalisés.",
    icon: GrStatusUnknownSmall,
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
  },
  {
    name: "Promolab",
    description:
      "Promolab is a dynamic web solutions provider, specializing in crafting engaging websites and web applications. We blend creativity and innovation to deliver digital solutions that stand out in the online landscape.",
    icon: GrStatusUnknownSmall,
    details: {
      about:
        "At Promolab, we're passionate about web technology and its potential to transform businesses. With a team of dedicated professionals, we strive to create digital experiences that captivate and connect. Our commitment to quality and client satisfaction drives us to deliver cutting-edge solutions tailored to your unique needs. Let us be your partner in the digital journey.",
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
      href: "https://promolab.vercel.app/",
    },
    accordion: [
      {
        question:
          "Can you create an e-commerce website like the one you created for Promolab?",
        answer:
          "Yes, I have experience in designing and developing e-commerce websites, and I can create one tailored to Promolab needs. Please provide details about your products, preferred features, and any specific design elements you have in mind so we can get started on your project.",
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
  },
  {
    name: "Vital Burst",
    description:
      "Vital Burst is an E-Commerce website for Supplements and Vitamins. I was responsible for the whole website development. It is build with Supliful.",
    icon: VitalBurstIcon,
    details: {
      about:
        "At Vital Burst, we offer the best supplement for the Bodybuilding Community, with a wide range of products from the best brands. We are committed to providing you with the best products and services, so you can achieve your goals and live a healthy life.",
      tech: [
        {
          name: "Supliful",
          icon: MdProductionQuantityLimits,
        },
        {
          name: "Adobe Illustrator",
          icon: SiAdobeillustrator,
        },
      ],
      href: "https://vitalburst.shopfront.live/",
    },
    accordion: [
      {
        question: "What kind of products do you sell?",
        answer:
          "We sell supplements and vitamins for the Bodybuilding Community.",
      },
      {
        question: "How can I request a quote or get in touch with you?",
        answer:
          "It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details, including a brief description of your project or any questions you have. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
      },
      {
        question: "I need help with my order. Who can I contact?",
        answer:
          "You can contact us by filling the form on the 'Contact' page on our website.",
      },
    ],
  },
  {
    name: "Ikrili",
    description:
      "Ikrili is a platform made for Students to look for a house to rent. It is build with NextJS, ReactJS, TailwindCSS and Supabase.",
    icon: BsFillHouseAddFill,
    details: {
      about:
        "At Ikrili, we offer the comfort of finding a house to rent in a few clicks. We are committed to providing you with the best products and services, so you can achieve your goals and live a healthy life.",
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
      href:
        "https://www.figma.com/file/BkhNVRUYwEDwD4bk4WBWQU/Ikrili?type=design&node-id=0%3A1&mode=design&t=BLDRwk0UQp1Cwb6U-1",
    },
    accordion: [
      {
        question: "Do you create Mobile Applications?",
        answer:
          "Currently, I'm partner with a Mobile Developer Agency called 'Chinka Studio'. We can create a Mobile Application for you. Please contact me for more information.",
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
  },
  {
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
  },
  {
    name: "Breadit",
    description: "A Reddit Clone made with NextJS, ReactJS and TailwindCSS.",
    icon: AiFillRedditCircle,
    details: {
      about:
        "Breadit is a Reddit Clone. It is build with NextJS, ReactJS and TailwindCSS. I watch Josh course on Youtube to create this project.",
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
          name: "PlanetScale",
          icon: SiPlanetscale,
        },
      ],
      href: "https://breadit-findmalek.vercel.app/",
    },
    accordion: [
      {
        question: "What did you learn from this project?",
        answer:
          "I learned how to create a Reddit Clone with NextJS, ReactJS and TailwindCSS.",
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
      name: "Breadit",
      iconSrc: "https://github.com/reddit.png",
      description: "A Reddit Clone made with NextJS, ReactJS and TailwindCSS.",
      date: "Created on June 2023",
      href: "https://github.com/FindMalek/Breadit",
    },
  },
  {
    name: "LazyTube",
    description:
      "LazyTube is a Discord Bot, notifies you when your favorite Youtube Creators upload a new video.",
    icon: AiFillYoutube,
    details: {
      about:
        "LazyTube is a project to help you track your YouTube Watch Time. It is build with Python, Youtube API and Discord API. This Discord Bot would notify you in your Discord Server everytime when one of your Youtube Creators upload a new video and offer you to download it or put it on Watch later.",
      tech: [
        {
          name: "Python",
          icon: BiLogoPython,
        },
        {
          name: "Youtube API",
          icon: AiFillYoutube,
        },
        {
          name: "Discord API",
          icon: BiLogoDiscordAlt,
        },
      ],
    },
    accordion: [
      {
        question: "Can I use LazyTube on my Discord Server ?",
        answer:
          "Yes, you can use LazyTube on your Discord Server. You can invite it from the link below.",
      },
      {
        question: "Can you create other Discord Bots that automates tasks ?",
        answer:
          "Yes, I can create other Discord Bots that automates tasks. Please contact me for more information.",
      },
      {
        question: "How can I request a quote or get in touch with you?",
        answer:
          "It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details, including a brief description of your project or any questions you have. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
      },
    ],
    github: {
      name: "LazyTube",
      iconSrc: "https://github.com/youtube.png",
      description:
        "LazyTube is a Discord Bot, notifies you when your favorite Youtube Creators upload a new video.",
      date: "Created on September 2020",
      href: "https://github.com/FindMalek/LazyTube",
    },
  },
  {
    name: "Move U",
    description:
      "Move U is a Fitness GYM, located in Tunisia, I manage their Social Media Accounts.",
    icon: GrStatusUnknownSmall,
    details: {
      about:
        "Move U is a Fitness GYM, I created their Graphic Design work, I create their Social Media Posts and I manage their Social Media Accounts.",
      tech: [
        {
          name: "Adobe Illustrator",
          icon: SiAdobeillustrator,
        },
      ],
      href: "https://www.instagram.com/moveu.tn/",
    },
    accordion: [
      {
        question: "Can you create a website for Move U ?",
        answer:
          "Yes, I can create a website for Move U. Please contact me for more information.",
      },
      {
        question:
          "I need a Community Manager and a Graphic Designer, can you help me ?",
        answer: "Yes, I can help you. Please contact me for more information.",
      },
      {
        question: "How can I request a quote or get in touch with you?",
        answer:
          "It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
      },
    ],
  },
  {
    name: "FitForme",
    description:
      "FitForme is a Fitness GYM, located in Tunisia, I manage their Social Media Accounts.",
    icon: GrStatusUnknownSmall,
    details: {
      about:
        "FitForme is a Fitness GYM, I created their Graphic Design work, I create their Social Media Posts and I manage their Social Media Accounts.",
      tech: [
        {
          name: "Adobe Illustrator",
          icon: SiAdobeillustrator,
        },
      ],
      href: "https://www.instagram.com/fitforme_123",
    },
    accordion: [
      {
        question: "Can you create a website for FitForme ?",
        answer:
          "Yes, I can create a website for FitForme. Please contact me for more information.",
      },
      {
        question:
          "I need a Community Manager and a Graphic Designer, can you help me ?",
        answer: "Yes, I can help you. Please contact me for more information.",
      },
      {
        question: "How can I request a quote or get in touch with you?",
        answer:
          "It's easy to get started! Simply visit the 'Contact' page on my website, where you'll find a contact form. Fill in your details. I'll get back to you promptly with the information you need and can provide a personalized quote based on your requirements.",
      },
    ],
  },
];

export default projects;
