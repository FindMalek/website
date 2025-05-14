import Link from "next/link"

import { LineShadowText } from "@/components/ui/line-shadow-text"

export default function Home() {
  return (
    <div className="pt-30 w-full px-4">
      <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:leading-snug xl:text-4xl">
        Full Stack Developer and{" "}
        <LineShadowText className="dark:text-primary italic">
          Design
        </LineShadowText>{" "}
        <LineShadowText className="dark:text-primary italic">
          Engineer
        </LineShadowText>{" "}
        currently{" "}
        <span className="whitespace-nowrap">
          based in 🇹🇳 Monastir, Tunisia.
        </span>
      </h1>

      <div className="text-foreground mt-4 space-y-4">
        <section>
          <p className="text-base leading-relaxed">
            Specialized in transforming complex ideas into elegant digital solutions through 
            web development, design engineering, and entrepreneurial innovation. I craft 
            meaningful projects that blend creativity with technical precision. View my{" "}
            <Link
              href="/work"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              WORK
            </Link>{" "}
            experience, explore my{" "}
            <Link
              href="/projects"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              PROJECTS
            </Link>{" "}
            or check out my technical{" "}
            <Link
              href="/stack"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              STACK
            </Link>{" "}
            to see how I bring ideas to life.
          </p>
        </section>

        <section>
          <p className="text-base leading-relaxed">
            Beyond code, I find creative inspiration in diverse music genres from Metal to Ambient,
            and maintain a curated collection of books that fuel my innovative thinking. Explore my{" "}
            <Link
              href="/about#playlists"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              PLAYLISTS
            </Link>{" "}
            or browse my recommended{" "}
            <Link
              href="/about#readings"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              BOOKS
            </Link>{" "}
            that shape my perspective. Ready to collaborate on something remarkable?{" "}
            <Link
              href="/contact"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              CONTACT ME
            </Link>{" "}
            to start the conversation.
          </p>
        </section>
      </div>
    </div>
  )
}
