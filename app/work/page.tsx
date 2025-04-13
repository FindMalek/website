import type { Metadata } from "next"
import Link from "next/link"
import { allWorks } from "content-collections"

import { CLIENTS } from "@/config/consts"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { WorkCard } from "@/components/app/work-card"
import { ClientShowcase } from "@/components/app/work-client-showcase"
import { Icons } from "@/components/shared/icons"
import { PageHeading } from "@/components/shared/page-heading"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Work",
}

export default function Work() {
  const orderedWorks = allWorks.sort((a, b) => a.id - b.id)

  return (
    <div className="w-full px-4 pt-20">
      <PageHeading
        title="Work"
        heading="I've been fortunate to work with some amazing companies and people."
      >
        <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:gap-4">
          <Link
            href={siteConfig.links.linkedin}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.linkedin className="mr-2 size-4" />
            Follow me on LinkedIn
          </Link>
          <Link
            href={siteConfig.links.resume}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.file className="mr-2 size-4" />
            Resume
          </Link>
          <Link
            href={"/contact?subject=Work"}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "w-full sm:w-auto"
            )}
          >
            Let&apos;s talk about work
          </Link>
        </div>
      </PageHeading>

      <div className="mx-auto mt-8 grid max-w-4xl gap-4 ">
        {orderedWorks.map((post) => (
          <WorkCard key={post._meta.path} work={post} />
        ))}
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl gap-4 pb-4 pt-16">
        <h2 className="text-muted-foreground text-center text-lg font-medium">
          I&apos;ve also worked with some amazing companies and people.
        </h2>
        <ClientShowcase clients={CLIENTS} />
      </div>
    </div>
  )
}
