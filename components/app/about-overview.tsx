import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { link } from "@/config/styles"
import { cn } from "@/lib/utils"

import { CopyText } from "@/components/shared/copy-text"
import { Icons } from "@/components/shared/icons"

export function AboutOverview() {
  return (
    <section className="mb-32" id="overview">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="space-y-6 lg:w-3/5">
          <p className="text-lg">
            Hi, I&apos;m Malek Gara-Hellal. I&apos;m a Design Engineer, Founder,
            and Creative Entrepreneur.
          </p>

          <p className="text-lg">
            I founded{" "}
            <Link
              href="https://undrstnd.dev"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Undrstnd Labs
            </Link>
            , an AI development and research lab focused on solving real-life
            problems through innovative web apps. Our work spans education with{" "}
            <span className={cn("font-semibold")}>Undrstnd Education</span> and{" "}
            <span className={cn("font-semibold")}>Undrstnd Developers</span>,
            and we continue to ship new applications to this day.
          </p>
          <p className="text-lg">
            Before that, I founded{" "}
            <Link
              href="https://www.linkedin.com/company/endless-byte/posts/?feedView=all"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Endless Byte
            </Link>
            , a startup specializing in web app development in Tunisia. We
            collaborated with numerous clients, particularly in developing
            e-commerce websites.
          </p>
          <p className="text-lg">
            I also co-founded{" "}
            <Link
              href="https://www.instagram.com/artweave.originals/"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Artweave
            </Link>
            , a clothing brand known for its innovative style, which was
            acquired by Tunisian Design in 2023.
          </p>
          <p className="text-lg">
            I&apos;m an active contributor to open-source projects and have designed
            several websites available on my{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              GitHub
            </Link>
            . Some of my notable contributions include{" "}
            <Link
              href={"https://midday.ai/"}
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Midday
            </Link>
            ,{" "}
            <Link
              href={"https://function03.xyz/"}
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Function03
            </Link>{" "}
            in Web3 ,{" "}
            <Link
              href={"tally-zero.preview.tally.xyz"}
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              TallyZero
            </Link>
            ,{" "}
            <Link
              href={"https://github.com/openstatusHQ/goat-stack"}
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              OpenStatus
            </Link>{" "}
            for Goat Stack , and many more.
          </p>
        </div>

        <div className="relative lg:w-2/5">
          <div className="lg:sticky lg:top-8">
            <div className="mb-6 overflow-hidden rounded-3xl">
              <Image
                src="/author.jpg"
                alt="Profile"
                width={500}
                height={500}
                className="aspect-square h-auto w-full object-cover grayscale transition-all duration-300 hover:grayscale-0"
              />
            </div>

            <div className="space-y-2">
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                className="flex items-center gap-2"
              >
                <Icons.instagram className="size-4" />
                <span className={cn(link, "text-sm")}>
                  Follow me on Instagram
                </span>
              </Link>
              <Link
                href={siteConfig.links.linkedin}
                target="_blank"
                className="flex items-center gap-2"
              >
                <Icons.linkedin className="size-4" />
                <span className={cn(link, "text-sm")}>
                  Follow me on LinkedIn
                </span>
              </Link>
              <Link
                href={siteConfig.links.github}
                className="flex items-center gap-2"
              >
                <Icons.github className="size-4" />
                <span className={cn(link, "text-sm")}>Follow me on Github</span>
              </Link>
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                className="flex items-center gap-2"
              >
                <Icons.x className="size-4" />
                <span className={cn(link, "text-sm")}>Follow me on X</span>
              </Link>
              <Link
                href={siteConfig.links.facebook}
                target="_blank"
                className="flex items-center gap-2"
              >
                <Icons.facebook className="size-4" />
                <span className={cn(link, "text-sm")}>
                  Follow me on Facebook
                </span>
              </Link>
              <CopyText
                text={siteConfig.author.email}
                className={cn("flex items-center gap-2", link)}
              >
                <Icons.mail className="size-4" />
              </CopyText>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
