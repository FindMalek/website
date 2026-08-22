import { Suspense } from "react"
import Link from "next/link"
import { allProjects, allWorks } from "content-collections"

import { REPOSITORIES } from "@/config/consts"
import { STACK_SECTIONS } from "@/config/stack"
import { getCachedContributions } from "@/lib/get-cached-contributions"
import {
  groupWorkByCompany,
  sortProjectsByStars,
  sortProjectsByStatus,
  sortWorkExperiences,
} from "@/lib/utils"

import { AboutBooks } from "@/components/app/about-books"
import { AboutMusic } from "@/components/app/about-music"
import { AboutOverview } from "@/components/app/about-overview"
import { ClientsMarquee } from "@/components/app/clients-marquee"
import { CollapsibleList } from "@/components/app/collapsible-list"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/app/github-contributions"
import { HelloTitle } from "@/components/app/hello-title"
import { Hero } from "@/components/app/hero"
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/app/panel"
import { ProjectItem } from "@/components/app/project-item"
import { ProjectOpenSourceCard } from "@/components/app/project-opensource-card"
import { StackSection } from "@/components/app/stack-section"
import { WorkExperienceItem } from "@/components/app/work-experience-item"

import { getMultipleRepoInfo } from "@/actions/github"
import { getUserPlaylists } from "@/actions/spotify"

const SOURCE_REPO_URL = REPOSITORIES[0]
const GITHUB_USERNAME = SOURCE_REPO_URL.split("/").at(-2) ?? "findmalek"

export default async function Home() {
  const playlists = await getUserPlaylists(20, 0)
  const orderedWorks = sortWorkExperiences(allWorks)
  const workGroups = groupWorkByCompany(orderedWorks)
  const orderedProjects = sortProjectsByStatus(allProjects)
  const openSourceProjects = await getMultipleRepoInfo(REPOSITORIES)
  const sortedOpenSourceProjects = sortProjectsByStars(openSourceProjects)
  const stackItemCount = STACK_SECTIONS.reduce(
    (total, section) => total + section.items.length,
    0
  )

  return (
    <div className="w-full">
      <Hero />

      <div className="stripe-divider" />

      <Panel id="about">
        <PanelHeader>
          <HelloTitle className="text-balance text-2xl font-bold leading-tight tracking-tight" />
          <PanelDescription>
            I&apos;m a Design Engineer, Founder, and Product Builder based in
            Monastir, Tunisia.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          <div className="text-foreground mb-8 space-y-4">
            <p className="text-base leading-relaxed">
              Specialized in transforming complex ideas into elegant digital
              solutions through web development, design engineering, and
              entrepreneurial innovation. I craft meaningful projects that blend
              creativity with technical precision. View my{" "}
              <Link
                href="/#work"
                className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
              >
                WORK
              </Link>{" "}
              experience, explore my{" "}
              <Link
                href="/#projects"
                className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
              >
                PROJECTS
              </Link>{" "}
              or check out my technical{" "}
              <Link
                href="/#stack"
                className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
              >
                STACK
              </Link>{" "}
              to see how I bring ideas to life.
            </p>

            <p className="text-base leading-relaxed">
              Beyond code, I find creative inspiration in diverse music genres
              from Metal to Ambient, and maintain a curated collection of books
              that fuel my innovative thinking. Explore my{" "}
              <Link
                href="/#playlists"
                className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
              >
                PLAYLISTS
              </Link>{" "}
              or browse my recommended{" "}
              <Link
                href="/#readings"
                className="hover:text-primary/80 font-semibold underline underline-offset-4 transition-all duration-200"
              >
                BOOKS
              </Link>{" "}
              that shape my perspective.
            </p>
          </div>

          <div className="mb-8">
            <Suspense fallback={<GitHubContributionsFallback />}>
              <GitHubContributions
                contributions={getCachedContributions(GITHUB_USERNAME)}
              />
            </Suspense>
          </div>

          <AboutOverview />
          <AboutMusic playlists={playlists.items} />
          <AboutBooks />
        </PanelContent>
      </Panel>

      <div className="stripe-divider" />

      <Panel id="work">
        <PanelHeader>
          <PanelTitle>
            Work
            <PanelTitleSup>{workGroups.length}</PanelTitleSup>
          </PanelTitle>
          <PanelDescription>
            I&apos;ve been fortunate to work with some amazing companies and
            people.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          <CollapsibleList
            items={workGroups.map((group, index) => (
              <WorkExperienceItem
                key={group.company}
                group={group}
                defaultOpen={index === 0}
              />
            ))}
            initialCount={4}
            step={2}
            className="flex flex-col"
          />
        </PanelContent>
      </Panel>

      <div className="stripe-divider" />

      <Panel>
        <PanelHeader>
          <PanelTitle className="text-lg">
            Companies I&apos;ve worked with
          </PanelTitle>
        </PanelHeader>

        <PanelContent className="overflow-hidden p-0">
          <ClientsMarquee />
        </PanelContent>
      </Panel>

      <div className="stripe-divider" />

      <Panel id="projects">
        <PanelHeader>
          <PanelTitle>
            Projects
            <PanelTitleSup>{orderedProjects.length}</PanelTitleSup>
          </PanelTitle>
          <PanelDescription>
            I love shipping products and open source software.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          <CollapsibleList
            items={orderedProjects.map((project) => (
              <ProjectItem key={project._meta.path} project={project} />
            ))}
            initialCount={6}
            step={4}
            className="flex flex-col"
          />

          <h3 className="mb-4 mt-12 text-xl font-semibold">Open Source</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedOpenSourceProjects.map((project) => (
              <ProjectOpenSourceCard key={project.name} project={project} />
            ))}
          </div>
        </PanelContent>
      </Panel>

      <div className="stripe-divider" />

      <Panel id="stack">
        <PanelHeader>
          <PanelTitle>
            Stack
            <PanelTitleSup>{stackItemCount}</PanelTitleSup>
          </PanelTitle>
          <PanelDescription>
            Tools, technology and apps I use every day.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          {STACK_SECTIONS.map((section, index) => (
            <StackSection key={index} section={section} index={index} />
          ))}
        </PanelContent>
      </Panel>
    </div>
  )
}
