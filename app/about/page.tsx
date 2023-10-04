import type { Metadata } from "next";

import {
  BiLogoGithub,
  BiLogoBehance,
  BiCodeAlt,
  BiCalendar,
  BiBook,
  BiCodeCurly,
  BiLogoSpotify,
} from "react-icons/bi";

import Header from "@/components/overall/Header";
import Footer from "@/components/sections/footer/Footer";

import Subtitle from "@/components/sections/about/Subtitle";
import HorizentalContent from "@/components/sections/about/HorizentalContent";

export const metadata: Metadata = {
  title: "About | FindServices",
  description:
    "FindServices | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer.",
};

const overall = [
  {
    name: "Engineering",
    sub: {
      is: false,
      name: "",
    },
    description:
      "The power of first impressions cannot be underestimated, and the gateway to capitalizing on them lies in exceptional website design. An outstanding website transcends mere aesthetics and extends its influence to encompass seamless functionality and user-friendly navigation. Drawing upon my expertise as a seasoned programmer, I possess the unique ability to tackle intricate technical challenges while crafting websites that exude sleekness and visual allure. Moreover, my extensive knowledge of recognized technical standards is complemented by my proficiency in modern building practices, ensuring that every aspect of your website is finely tuned to perfection.",
    linkText: "View GitHub",
    href: "https://github.com/FindMalek",
    target: "_blank",
    icon: BiLogoGithub,
  },
  {
    name: "Product",
    sub: {
      is: false,
      name: "",
    },
    description:
      "While I may not fit the conventional mold of a product manager, my diverse skill set in research, product design, and product coordination empowers me to drive the growth of a product from its inception. As an exceptional analytical thinker, I possess the ability to uphold the product's vision throughout its entire journey, effectively bridging the technical and product aspects. By leveraging my expertise, I can navigate the path from 0 to 1, ensuring the product's success at every stage.",
    linkText: "View Product",
    href: "/projects",
    target: "_self",
    icon: BiCodeAlt,
  },
  {
    name: "Design",
    sub: {
      is: false,
      name: "",
    },
    description:
      "Despite not fitting the typical designer stereotype, my exceptional visual abilities enable me to excel as a presenter, effectively conveying design concepts to stakeholders and design teams. I possess a remarkable aptitude for conceptualization, allowing me to envision and bring forth stunning creations. Additionally, my expertise lies in fine-tuning stylesheets and crafting seamless user experiences that flow effortlessly.",
    linkText: "View Behance",
    href: "https://www.behance.net/malekpy",
    target: "_blank",
    icon: BiLogoBehance,
  },
];

const ventures = [
  {
    name: "Artweave.",
    sub: {
      is: true,
      name: "Co-Founder",
    },
    description:
      "Artweave is more than just a clothing brand; it's a captivating fusion of tradition and modernity. Based in Tunisia, we redefine streetwear fashion through our unique blend of traditional tapestry and contemporary design. Each piece we create tells a story, showcasing the power of artistry and craftsmanship. Join us on a journey to revolutionize the fashion industry as we seamlessly intertwine textile artistry with the allure of modern streetwear. Explore our collection and be part of the Artweave experience.",
    linkText: "2022",
    href: "/projects#artweave",
    target: "_self",
    icon: BiCalendar,
  },
  {
    name: "Endless Byte.",
    sub: {
      is: true,
      name: "Founder",
    },
    description:
      "Discover Endless Byte, a web development venture I proudly founded. We are a dedicated team of developers committed to delivering top-tier web solutions with unwavering professionalism. With a focus on precision and innovation, we breathe life into digital projects, ensuring they seamlessly merge form and function. Explore our portfolio to witness the excellence we bring to the world of web development.",
    linkText: "2023",
    href: "/projects#endless-byte",
    target: "_self",
    icon: BiCalendar,
  },
  {
    name: "FindServices.",
    sub: {
      is: true,
      name: "Founder",
    },
    description:
      "FindServices is my portoflio website. It's a platform that showcases my work and my skills. It's also a platform that I use to share my thoughts and my ideas. I am a full-stack developer and I am currently working on this website.",
    linkText: "2023",
    href: "/projects#findservices",
    target: "_self",
    icon: BiCalendar,
  },
];

const reads = [
  {
    name: "Atomic Habits.",
    sub: {
      is: true,
      name: "James Clear",
    },
    description:
      "An atomic habit is a regular practice or routine that is not only small and easy to do but is also the source of incredible power; a component of the system of compound growth. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change.",
    linkText: "View Book",
    href: "https://www.goodreads.com/book/show/40121378-atomic-habits",
    target: "_blank",
    icon: BiBook,
  },
  {
    name: "The Brothers Karamazov.",
    sub: {
      is: true,
      name: "Fyodor Dostoyevsky",
    },
    description:
      "The Brothers Karamazov is a passionate philosophical novel set in 19th century Russia, that enters deeply into the ethical debates of God, free will, and morality. It is a spiritual drama of moral struggles concerning faith, doubt, and reason, set against a modernizing Russia.",
    linkText: "View Book",
    href: "https://www.goodreads.com/book/show/4934.The_Brothers_Karamazov",
    target: "_blank",
    icon: BiBook,
  },
  {
    name: "The 48 Laws of Power.",
    sub: {
      is: true,
      name: "Robert Greene",
    },
    description:
      "The 48 Laws of Power is a non-fiction book by American author Robert Greene. The book is a bestseller, selling over 1.2 million copies in the United States, and is popular with prison inmates and celebrities.",
    linkText: "View Book",
    href: "https://www.goodreads.com/book/show/1303.The_48_Laws_of_Power",
    target: "_blank",
    icon: BiBook,
  },
  {
    name: "Learning some greatness.",
    sub: {
      is: false,
      name: "",
    },
    description:
      "We continue learning everyday. Life is meaningless and yet filled with purposes. Go out there and learn something new.",
    linkText: "Currently",
    href: "/projects",
    target: "_self",
    icon: BiCodeCurly,
  },
];

const playlists = [
  {
    name: "Steel Strong.",
    sub: {
      is: true,
      name: "MALEK",
    },
    description:
      "Get pumped and power through your workout with this collection of heavy-hitting metal tracks. Cover: Parkway Drive",
    linkText: "View Playlist",
    href: "https://open.spotify.com/playlist/2ERIGeqJae4dw0COhtSVCc?si=e0ead7ee92974419",
    target: "_blank",
    icon: BiLogoSpotify,
  },
  {
    name: "Melancholic Dreams.",
    sub: {
      is: true,
      name: "MALEK",
    },
    description:
      "This playlist features haunting and atmospheric tracks that explore themes of loss, heartache, and despair. Expect to hear brooding vocals, haunting melodies, and emotive lyrics that will leave you feeling both moved and inspired. ",
    linkText: "View Playlist",
    href: "https://open.spotify.com/playlist/4uau55EZrUw4hrQf4La32i?si=2345b9f75b744a87",
    target: "_blank",
    icon: BiLogoSpotify,
  },
  {
    name: "War and Glory.",
    sub: {
      is: true,
      name: "MALEK",
    },
    description:
      "A power metal playlist exploring Great Wars and Great History through epic tracks and powerful vocals. Cover: Sabaton",
    linkText: "View Playlist",
    href: "https://open.spotify.com/playlist/2lbgWON6x5EVK2kI5v6FQv?si=230dd860b4a34414",
    target: "_blank",
    icon: BiLogoSpotify,
  },
  {
    name: "Essential Indie.",
    sub: {
      is: true,
      name: "Spotify",
    },
    description:
      "The best new music from indie artists and bands. This playlist is updated regularly, so it won't be long till you hear the newest stuff.",
    linkText: "View Playlist",
    href: "https://open.spotify.com/playlist/37i9dQZF1DX26DKvjp0s9M?si=803d799eaaa34e36",
    target: "_blank",
    icon: BiLogoSpotify,
  },
];

export default function About() {
  return (
    <>
      <Header name="About Me." />

      <HorizentalContent sectionId="overall" content={overall} />

      <Subtitle name="My Ventures." />
      <HorizentalContent sectionId="my-ventures" content={ventures} />

      <Subtitle name="My Reads." />
      <HorizentalContent sectionId="my-reads" content={reads} />

      <Subtitle name="My Playlists." />
      <HorizentalContent sectionId="my-playlists" content={playlists} />

      <Footer name="Let's Continue to Projects" href="/projects" />
    </>
  );
}
