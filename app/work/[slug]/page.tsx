import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXContent } from "@content-collections/mdx/react"
import { allWorks } from "content-collections"

import { convertWorkType } from "@/config/converter"
import { link as linkStyle } from "@/config/styles"
import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"

interface WorkPageByIdProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allWorks.map((work) => ({
    slug: work.href.split("/").pop(),
  }))
}

export async function generateMetadata({ params }: WorkPageByIdProps) {
  const { slug } = await params
  const work = allWorks.find((work) => work.href === `/work/${slug}`)

  if (!work) {
    notFound()
  }

  return {
    title: work.company,
    description: work.overview,
  }
}

export default async function WorkPageById({ params }: WorkPageByIdProps) {
  const { slug } = await params

  const work = allWorks.find((work) => work.href === `/work/${slug}`)

  if (!work) {
    notFound()
  }

  const {
    logo,
    logoClassName,
    company,
    position,
    type,
    startDate,
    endDate,
    place,
    link,
    html,
    overview,
  } = work

  return (
    <div className="container max-w-4xl px-4 py-16 md:py-24">
      <div className="relative mx-auto">
        <Link
          href="/work"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "absolute -top-8 left-0"
          )}
        >
          <Icons.chevronLeft className="mr-1 size-4" />
          Back to Work
        </Link>

        <div className="mb-8 flex justify-center">
          <div className="border-border size-16 overflow-hidden rounded-lg border">
            <Image
              src={logo || "/placeholder.svg"}
              alt={`${company} logo`}
              width={64}
              height={64}
              className={cn("size-full object-cover", logoClassName)}
            />
          </div>
        </div>

        <h1 className="mb-6 text-center text-4xl font-bold">
          {position} at {company}
        </h1>

        <p className="text-muted-foreground mb-8 text-center text-lg">
          {overview}
        </p>

        <div className="text-muted-foreground mb-3 flex flex-wrap items-center justify-center gap-2">
          <span>{convertWorkType(type)}</span>
          <span className="hidden md:inline">•</span>
          <span>{`${startDate} — ${endDate}`}</span>
          <span className="hidden md:inline">•</span>
          <span>{place}</span>
        </div>

        {link && (
          <div className="mb-16 flex justify-center">
            <Link
              href={link}
              target="_blank"
              className={cn(
                "hover:text-foreground text-muted-foreground transition-colors",
                linkStyle
              )}
            >
              {link.replace(/^https?:\/\/(www\.)?/, "")}
            </Link>
          </div>
        )}

        <div className="prose prose-gray dark:prose-invert mx-auto max-w-3xl">
          <MDXContent code={html} />
        </div>
      </div>
    </div>
  )
}
