import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allProjects } from "content-collections"

import {
  convertProjectStatus,
  convertProjectStatusColor,
} from "@/config/converter"
import { link as linkStyle } from "@/config/styles"
import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.href.split("/").pop(),
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = allProjects.find(
    (project) => project.href === `/projects/${slug}`
  )

  if (!project) {
    notFound()
  }

  return {
    title: project.name,
    description: project.overview,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params

  const project = allProjects.find(
    (project) => project.href === `/projects/${slug}`
  )

  if (!project) {
    notFound()
  }

  const { image, name, overview, status, link, html } = project

  return (
    <div className="container max-w-4xl px-4 py-16 md:py-24">
      <div className="relative mx-auto">
        <Link
          href="/projects"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "absolute -top-8 left-0"
          )}
        >
          <Icons.chevronLeft className="mr-1 size-4" />
          Back to Projects
        </Link>

        <div className="mb-8 pt-2">
          <div className="border-secondary relative min-h-[120px] w-full overflow-hidden rounded-lg border-2 bg-white md:min-h-[250px]">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={image}
                alt={`${name} cover image`}
                className="object-cover"
                fill
                priority
              />
            </AspectRatio>
          </div>
        </div>

        <h1 className="mb-4 text-center text-4xl font-bold">{name}</h1>

        <p className="text-muted-foreground mb-8 text-center text-lg">
          {overview}
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <Badge
            variant="outline"
            className={cn(
              "px-3 py-1 font-medium capitalize",
              convertProjectStatusColor(status)
            )}
          >
            {convertProjectStatus(status)}
          </Badge>
          {link && (
            <>
              <span className="hidden md:inline">•</span>
              <Link
                href={link}
                target="_blank"
                className={cn(
                  "hover:text-foreground text-muted-foreground transition-colors",
                  linkStyle
                )}
              >
                {link.replace(/^https?:\/\/(www\\.)?/, "")}
              </Link>
            </>
          )}
        </div>

        {html && (
          <div className="prose prose-gray dark:prose-invert mx-auto max-w-3xl">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    </div>
  )
}
