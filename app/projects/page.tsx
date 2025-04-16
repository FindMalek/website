import type { Metadata } from "next"
import Link from "next/link"
import { allProjects } from "content-collections"

import { OPEN_SOURCE_PROJECTS } from "@/config/consts"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { ProjectCard } from "@/components/app/project-card"
import { ProjectOpenSourceCard } from "@/components/app/project-opensource-card"
import { Icons } from "@/components/shared/icons"
import { PageHeading } from "@/components/shared/page-heading"
import { SectionHeading } from "@/components/shared/section-heading"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Projects",
  description: "I love shipping products and open source software.",
}

export default function ProjectsPage() {
  const orderedProjects = allProjects.sort((a, b) => a.id - b.id)

  return (
    <div className="w-full px-4 pt-20">
      <PageHeading
        title="Projects"
        heading="I love shipping products and open source software."
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
            href={siteConfig.links.github}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.github className="mr-2 size-4" />
            Follow me on GitHub
          </Link>
        </div>
      </PageHeading>

      <div className="mx-auto mt-8 grid max-w-4xl gap-4">
        {orderedProjects.map((project) => (
          <ProjectCard key={project._meta.path} project={project} />
        ))}
      </div>

      <SectionHeading
        title="Open Source"
        description="I love building things for the open source community. I create and maintain a number of projects — I hope you find them useful!"
        className="mt-16"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {OPEN_SOURCE_PROJECTS.map((project) => (
          <ProjectOpenSourceCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  )
}
