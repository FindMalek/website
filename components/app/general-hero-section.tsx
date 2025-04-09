import Link from "next/link"

export function GeneralHeroSection() {
  return (
    <>
      <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:leading-snug xl:text-4xl">
        Full Stack Developer and Design Engineer currently{" "}
        <span className="whitespace-nowrap">
          based in 🇹🇳 Monastir, Tunisia.
        </span>
      </h1>

      <div className="text-foreground mt-4 space-y-2">
        <section>
          <p className="text-base">
            The person for web development, graphic design, and creative
            entrepreneurship. I have a passion for turning lines of code into
            meaningful projects, and I&apos;m known for my meticulous
            organization. Explore my{" "}
            <Link
              href="#"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              PROJECTS
            </Link>{" "}
            to join me on my creative journey.
          </p>
        </section>

        <section>
          <p className="text-base">
            In my free time, I draw inspiration from Metal, Pop, and Chill
            music, and I&apos;m an avid reader always on the lookout for fresh
            ideas. Explore my favorite{" "}
            <Link
              href="#"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              PLAYLISTS
            </Link>{" "}
            and discover my handpicked{" "}
            <Link
              href="#"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              BOOKS
            </Link>{" "}
            for inspiration. Ready to create something extraordinary? Don&apos;t
            hesitate to{" "}
            <Link
              href="#"
              className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
            >
              CONTACT ME
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
