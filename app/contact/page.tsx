import type { Metadata } from "next";

import Header from "@/components/sections/display/Header";
import Footer from "@/components/sections/display/Footer";

import Description from "@/components/sections/display/Descritpion";
import ContactForm from "@/components/sections/form/ContactForm";

export const metadata: Metadata = {
  title: "Contact | FindMalek",
};

export default function Contact() {
  return (
    <>
      <Header name="Contact." />

      <Description />
      <ContactForm />

      <Footer name="Go Back to the Landing Page." href="/" />
    </>
  );
}
