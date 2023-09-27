import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | FindServices",
  description:
    "FindServices | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer.",
};

export default function Contact() {
    return (
      <>
        <h1 className="text-4xl font-bold text-center text-white">Hello, this is the Contact page</h1>
      </>
    );
  }
  