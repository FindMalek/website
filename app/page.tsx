import type { Metadata } from "next";

import Herosection from "@/components/sections/display/Hero";
import Footer from "@/components/sections/display/Footer";

export const metadata: Metadata = {
  title: "Home | FindMalek",
};

export default function About() {
  return (
    <>
      <Herosection />
      <Footer name="See more about me" href="/about" />
    </>
  );
}
