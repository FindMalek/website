"use client";

import {
  BiLogoSpotify,
  BiLogoPython,
  BiLogoReact,
  BiLogoTailwindCss,
  BiLogoShopify,
  BiLogoNodejs,
} from "react-icons/bi";
import { SiFfmpeg, SiJson, SiAdobeillustrator } from "react-icons/si";
import { GrStatusUnknownSmall } from "react-icons/gr";
import { TbBrandNextjs } from "react-icons/tb";
import { RiSupabaseFill } from "react-icons/ri";
import { MdProductionQuantityLimits } from "react-icons/md";
import { BsFillHouseAddFill } from "react-icons/bs";
import { PiShirtFoldedFill } from "react-icons/pi";

import { VitalBurstIcon } from "@/components/overall/Icons";

import Project from "@/components/sections/projects/Project";

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
      duration: 57,
      delivary: "On going",
    },
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
      duration: 3,
      delivary: "23, September 2023",
      website: "https://digi-ar.vercel.app/",
    },
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
      duration: 10,
      delivary: "11, August 2023",
      website: "https://lilypharma.myshopify.com/",
    },
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
      duration: 10,
      delivary: "On going",
      website: "https://promolab.vercel.app/",
    },
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
      duration: 2,
      delivary: "On going",
      website: "https://vitalburst.shopfront.live/",
    },
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
      duration: 2,
      delivary: "On going",
      website:
        "https://www.figma.com/file/BkhNVRUYwEDwD4bk4WBWQU/Ikrili?type=design&node-id=0%3A1&mode=design&t=BLDRwk0UQp1Cwb6U-1",
    },
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
      duration: 3,
      delivary: "25, Septembre 2023",
      website: "https://tarkhan.fr/",
    },
  },
];

export function GridProjects() {
  return (
    <div className="my-16 xl:max-w-none">
      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        <div>
          {projects.slice(0, Math.ceil(projects.length / 2)).map((project) => (
            <Project key={project.name} project={project} />
          ))}
        </div>
        <div>
          {projects.slice(Math.ceil(projects.length / 2)).map((project) => (
            <Project key={project.name} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
