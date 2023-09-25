import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | FindServices",
  description:
    "FindServices | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer.",
};

export default function About() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center text-white">Hello, this is the Home page</h1>
    </>
  );
}
