import Link from "next/link"
import { allProjects, allWorks } from "content-collections"

import { REPOSITORIES } from "@/config/consts"
import { STACK_SECTIONS } from "@/config/stack"
import {
  sortProjectsByStars,
  sortProjectsByStatus,
  sortWorkExperiences,
} from "@/lib/utils"

import { AboutBooks } from "@/components/app/about-books"
import { AboutMusic } from "@/components/app/about-music"
import { AboutOverview } from "@/components/app/about-overview"
import { CollapsibleList } from "@/components/app/collapsible-list"
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from "@/components/app/panel"
import { ProjectCardCompact } from "@/components/app/project-card-compact"
import { ProjectOpenSourceCard } from "@/components/app/project-opensource-card"
import { StackSection } from "@/components/app/stack-section"
import { WorkCardCompact } from "@/components/app/work-card-compact"
import { LineShadowText } from "@/components/ui/line-shadow-text"

import { getMultipleRepoInfo } from "@/actions/github"
import { getUserPlaylists } from "@/actions/spotify"

export default async function Home() {
  const playlists = await getUserPlaylists(20, 0)
  const orderedWorks = sortWorkExperiences(allWorks)
  const orderedProjects = sortProjectsByStatus(allProjects)
  const openSourceProjects = await getMultipleRepoInfo(REPOSITORIES)
  const sortedOpenSourceProjects = sortProjectsByStars(openSourceProjects)

  return (
    <div className="w-full">
      <section className="px-4 pt-30">
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
              Specialized in transforming complex ideas into elegant digital
              solutions through web development, design engineering, and
              entrepreneurial innovation. I craft meaningful projects that
              blend creativity with technical precision. View my{" "}
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
          </section>

          <section>
            <p className="text-base leading-relaxed">
              Beyond code, I find creative inspiration in diverse music genres
              from Metal to Ambient, and maintain a curated collection of
              books that fuel my innovative thinking. Explore my{" "}
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
          </section>
        </div>
      </section>

      <div className="stripe-divider mt-24" />

      <Panel id="about">
        <PanelHeader>
          <PanelTitle>About</PanelTitle>
          <PanelDescription>
            I&apos;m a Design Engineer, Founder, and Product Builder.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          <AboutOverview />
          <AboutMusic playlists={playlists.items} />
          <AboutBooks />
        </PanelContent>
      </Panel>

      <div className="stripe-divider" />

      <Panel id="work">
        <PanelHeader>
          <PanelTitle>Work</PanelTitle>
          <PanelDescription>
            I&apos;ve been fortunate to work with some amazing companies and
            people.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          <CollapsibleList
            visible={orderedWorks
              .slice(0, 4)
              .map((work) => (
                <WorkCardCompact key={work._meta.path} work={work} />
              ))}
            hidden={orderedWorks
              .slice(4)
              .map((work) => (
                <WorkCardCompact key={work._meta.path} work={work} />
              ))}
            className="grid gap-3"
          />
        </PanelContent>
      </Panel>

      <div className="stripe-divider" />

      <Panel id="projects">
        <PanelHeader>
          <PanelTitle>Projects</PanelTitle>
          <PanelDescription>
            I love shipping products and open source software.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          <CollapsibleList
            visible={orderedProjects
              .slice(0, 6)
              .map((project) => (
                <ProjectCardCompact key={project._meta.path} project={project} />
              ))}
            hidden={orderedProjects
              .slice(6)
              .map((project) => (
                <ProjectCardCompact key={project._meta.path} project={project} />
              ))}
            className="grid gap-4 sm:grid-cols-2"
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
          <PanelTitle>Stack</PanelTitle>
          <PanelDescription>
            Tools, technology and apps I use every day.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          {STACK_SECTIONS.map((section, index) => (
            <StackSection key={index} section={section} />
          ))}
        </PanelContent>
      </Panel>
    </div>
  )
}
