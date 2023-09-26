import "@/styles/globals.css";


import Header from "@/components/navigation/Header";
import Background from "@/components/overall/Background";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FindServices | Malek Gara-Hellal - Web Developer, Graphic Designer, and Writer.",
  description:
    "FindServices | Find services near you, anywhere in the world. This is me Malek Gara-Hellal and I am a full-stack developer. I am also a graphic designer and a writer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={poppins.className}>
        <Header />
        <div className="mx-auto max-w-4xl pl-12 pb-24 pt-10 sm:pb-32">
          {children}
        </div>
        <Background />
      </body>
    </html>
  );
}
