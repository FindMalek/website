import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allWorks } from "content-collections"

import { convertWorkType } from "@/config/converter"
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
  } = work

  return (
    <div className="container px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-start gap-6">
          <div className="border-border size-16 overflow-hidden rounded-lg border">
            <Image
              src={logo}
              alt={`${company} logo`}
              width={64}
              height={64}
              className={cn("size-full object-cover", logoClassName)}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{position}</h1>
            <p className="text-muted-foreground text-xl">{company}</p>

            <div className="text-muted-foreground mt-4 flex items-center gap-2">
              <span>{convertWorkType(type)}</span>
              <span>•</span>
              <span>{`${startDate} - ${endDate}`}</span>
              <span>•</span>
              <span>{place}</span>
            </div>

            {link && (
              <div className="mt-4">
                <Link
                  href={link}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  <Icons.arrowRight className="mr-2 size-4" />
                  Visit website
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: html || "" }} />
        </div>
      </div>
    </div>
  )
}
