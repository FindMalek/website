import type { Metadata } from "next";

import Header from "@/components/overall/Header";
import Footer from "@/components/sections/footer/Footer";

import { GridProjects } from "@/components/sections/projects/GridProjects";

export const metadata: Metadata = {
  title: "Projects | FindMalek",
  description:
    "The person for web development, graphic design, and creative entrepreneurship. I have a passion for turning lines of code into meaningful projects, and I'm known for my meticulous organization.",
  openGraph: {
    title:
      "FindMalek | Malek Gara-Hellal - Web Developer, Entrepreneur and Graphic Designer.",
    description:
      "The person for web development, graphic design, and creative entrepreneurship. I have a passion for turning lines of code into meaningful projects, and I'm known for my meticulous organization.",
    url: "https://www.findservices.tech/",
    siteName: "FindMalek",
    type: "website",
    images: ["https://www.findservices.tech/thumbnail.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "FindMalek | Malek Gara-Hellal - Web Developer, Entrepreneur and Graphic Designer.",
    description:
      "The person for web development, graphic design, and creative entrepreneurship. I have a passion for turning lines of code into meaningful projects, and I'm known for my meticulous organization.",
  },
};

export default function Projects() {
  return (
    <>
      <Header name="Projects." />

      <GridProjects />

      <Footer name="Convinced yet to contact me ?" href="/contact" />
    </>
  );
}
