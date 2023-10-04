import Link from "next/link";
import Header from "@/components/overall/Header";

export default function Herosection() {
  return (
    <>
      <Header name="I'm Malek Gara-Hellal." />

      <p className="text-base font-light pt-6 text-left dark:text-white">
        The person you need for web development, graphic design, and code
        artistry. I don't just build websites; I craft immersive online
        experiences that blend aesthetics and functionality. Explore my{" "}
        <Link
          href="/projects"
          className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1"
        >
          PROJECTS
        </Link>{" "}
        to follow my creative journey.
      </p>
      <p className="text-base font-light pt-4 text-left dark:text-white">
        Devoted to minimalistic design, I find beauty in simplicity and
        precision. Beyond coding and digital craftsmanship, I'm immersed in
        Metal and Pop Music, drawing inspiration for my next masterpiece. Check
        out my favorite{" "}
        <Link
          href="/about#my-playlists"
          className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1"
        >
          PLAYLISTS
        </Link>{" "}
        and discover my handpicked{" "}
        <Link
          href="/about#my-reads"
          className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1"
        >
          BOOKS
        </Link>{" "}
        for inspiration.
      </p>

      <p className="text-base font-light pt-4 text-left dark:text-white">
        Ready to collaborate and create something extraordinary together? Don't
        hesitate to{" "}
        <Link
          href="/contact"
          className="font-semibold dark:text-cyan-100 hover:text-cyan-600 hover:underline hover:underline-offset-1"
        >
          CONTACT ME
        </Link>
        .
      </p>
    </>
  );
}
