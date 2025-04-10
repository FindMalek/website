import type { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"
import { PageHeading } from "@/components/shared/page-heading"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Work",
}

export default function Work() {
  return (
    <div className="w-full px-4 pt-20">
      <PageHeading
        title="Work"
        heading="I've been fortunate to work with some amazing companies and people."
      >
        {" "}
        <div className="flex flex-row gap-4 pt-4">
          <Link
            href={siteConfig.links.linkedin}
            target="_blank"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <Icons.linkedin className="size-4" />
            Follow me on LinkedIn
          </Link>
          <Link
            href={siteConfig.links.resume}
            target="_blank"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <Icons.file className="size-4" />
            Resume
          </Link>
          <Link
            href={"/contact?subject=Work"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Let&apos;s talk about work
          </Link>
        </div>
      </PageHeading>
    </div>
  )
}
