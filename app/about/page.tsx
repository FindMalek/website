import type { Metadata } from "next";

import Header from "@/components/overall/Header";
import Footer from "@/components/sections/footer/Footer";

import HorizentalContent from "@/components/sections/about/HorizentalContent";

export const metadata: Metadata = {
  title: "About | FindServices",
  description:
    "FindServices | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer.",
};

export default function About() {
  return (
    <>
      <Header name="About Me." />

      <HorizentalContent name="My Story" />

      <Footer name="Let's Continue to Projects" href="/projects" />
    </>
  );
}
