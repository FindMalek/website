import type { Metadata } from "next";

import Header from "@/components/overall/Header";
import Footer from "@/components/sections/footer/Footer";

import Description from "@/components/sections/contact/Descritpion";
import ContactForm from "@/components/sections/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | FindServices",
  description:
    "FindServices | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer.",
};

export default function Contact() {
  return (
    <>
      <Header name="Contact." />

      <Description />
      <ContactForm />

      <Footer name="Go back home." href="/" />
    </>
  );
}
