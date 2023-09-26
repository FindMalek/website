import type { Metadata } from "next";

import Herosection from "@/components/sections/home/Herosection";

export const metadata: Metadata = {
  title: "Home | FindServices",
  description:
    "FindServices | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer.",
};

export default function About() {
  return (
    <>
      <Herosection />
    </>
  );
}
