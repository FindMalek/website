import type { Metadata } from "next";

import Header from "@/components/overall/Header";
import Footer from "@/components/sections/footer/Footer";

import { GridProjects } from "@/components/sections/projects/GridProjects";

export const metadata: Metadata = {
  title: "Projects | FindServices",
  description:
    "FindServices | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer.",
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
