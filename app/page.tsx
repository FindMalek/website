import type { Metadata } from "next";

import Herosection from "@/components/sections/display/Hero";
import Footer from "@/components/sections/display/Footer";

export const metadata: Metadata = {
  title: "Home | FindMalek",
  description:
    "FindMalek | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer.",
};

export default function About() {
  return (
    <>
      <Herosection />
      <Footer name="See More About Me" href="/about" />
    </>
  );
}
