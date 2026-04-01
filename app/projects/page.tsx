import type { Metadata } from "next"
import Link from "next/link"
import { allProjects } from "content-collections"

import { REPOSITORIES } from "@/config/consts"
import { siteConfig } from "@/config/site"
import { sortProjectsByStars, sortProjectsByStatus } from "@/lib/utils"

import { ProjectCard } from "@/components/app/project-card"
import { ProjectOpenSourceCard } from "@/components/app/project-opensource-card"
import { Icons } from "@/components/shared/icons"

import { getMultipleRepoInfo } from "@/actions/github"
import { Win2kClock } from "@/components/app/win2k-clock"

export const metadata: Metadata = {
  title: "Projects",
  description: "I love shipping products and open source software.",
}

export default async function ProjectsPage() {
  const orderedProjects = sortProjectsByStatus(allProjects)
  const openSourceProjects = await getMultipleRepoInfo(REPOSITORIES)
  const sortedOpenSourceProjects = sortProjectsByStars(openSourceProjects)

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#008080",
        fontFamily: "Tahoma, sans-serif",
      }}
    >
      {/* Desktop area with window */}
      <div className="container mx-auto max-w-5xl p-4 pt-6 md:p-8">
        {/* Main window chrome */}
        <div
          style={{
            border: "2px solid",
            borderColor: "#fff #888 #888 #fff",
            background: "#d4d0c8",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center justify-between px-2 py-1"
            style={{
              background: "linear-gradient(to right, #0a246a, #a6b5e7)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-3.5 w-3.5"
                style={{
                  background: "#d4d0c8",
                  border: "1px solid #000",
                }}
              />
              <span className="text-xs font-bold text-white">
                Projects - Windows 2000 Professional
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              {["_", "□", "×"].map((c) => (
                <span
                  key={c}
                  className="flex h-5 w-6 items-center justify-center text-[11px] font-bold text-black"
                  style={{
                    background: "#d4d0c8",
                    border: "1px solid",
                    borderColor: "#fff #888 #888 #fff",
                    lineHeight: 1,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Menu bar */}
          <div
            className="flex items-center gap-4 px-2 py-1 text-[11px]"
            style={{
              background: "#d4d0c8",
              borderBottom: "1px solid #888",
            }}
          >
            {["File", "Edit", "View", "Favorites", "Tools", "Help"].map(
              (m) => (
                <span
                  key={m}
                  className="cursor-default select-none text-black hover:bg-[#0a246a] hover:text-white px-1"
                >
                  <u>{m[0]}</u>
                  {m.slice(1)}
                </span>
              )
            )}
          </div>

          {/* Toolbar */}
          <div
            className="flex items-center gap-2 px-2 py-1"
            style={{
              background: "#d4d0c8",
              borderBottom: "1px solid #888",
            }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center text-[9px] font-bold text-black"
              style={{
                border: "2px solid",
                borderColor: "#fff #888 #888 #fff",
                background: "#d4d0c8",
              }}
            >
              ⬅
            </div>
            <div
              className="flex h-6 w-6 items-center justify-center text-[9px] font-bold text-black"
              style={{
                border: "2px solid",
                borderColor: "#fff #888 #888 #fff",
                background: "#d4d0c8",
              }}
            >
              ⬆
            </div>
            <div
              className="flex-1 px-2 py-0.5 text-[11px] text-black"
              style={{
                border: "2px solid",
                borderColor: "#888 #fff #fff #888",
                background: "#fff",
              }}
            >
              C:\Users\findmalek\Projects
            </div>
          </div>

          {/* Content area — scrollable window inside */}
          <div
            className="p-2"
            style={{
              background: "#d4d0c8",
            }}
          >
            <div
              className="max-h-[calc(100vh-14rem)] overflow-y-auto p-4"
              style={{
                border: "2px solid",
                borderColor: "#888 #fff #fff #888",
                background: "#fff",
              }}
            >
              {/* Header section */}
              <div className="mb-6">
                <h1
                  className="mb-1 text-2xl font-bold text-[#000080]"
                  style={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  Projects
                </h1>
                <p
                  className="mb-4 text-sm text-black"
                  style={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  I love shipping products and open source software.
                </p>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={siteConfig.links.linkedin}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-black no-underline hover:bg-[#eaeaea]"
                    style={{
                      border: "2px solid",
                      borderColor: "#fff #888 #888 #fff",
                      background: "#d4d0c8",
                      fontFamily: "Tahoma, sans-serif",
                    }}
                  >
                    <Icons.linkedin className="h-3.5 w-3.5" />
                    Follow on LinkedIn
                  </Link>
                  <Link
                    href={siteConfig.links.github}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-black no-underline hover:bg-[#eaeaea]"
                    style={{
                      border: "2px solid",
                      borderColor: "#fff #888 #888 #fff",
                      background: "#d4d0c8",
                      fontFamily: "Tahoma, sans-serif",
                    }}
                  >
                    <Icons.github className="h-3.5 w-3.5" />
                    Follow on GitHub
                  </Link>
                </div>
              </div>

              {/* Project cards */}
              <div className="mb-8 flex flex-col gap-4">
                {orderedProjects.map((project) => (
                  <ProjectCard key={project._meta.path} project={project} />
                ))}
              </div>

              {/* Open Source heading */}
              <div
                className="mb-4 mt-8 border-b-2 pb-2"
                style={{ borderColor: "#000080" }}
              >
                <h2
                  className="text-xl font-bold text-[#000080]"
                  style={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  Open Source
                </h2>
                <p
                  className="mt-1 text-xs text-black"
                  style={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  I love building things for the open source community. I create and maintain a number of projects — I hope you find them useful!
                </p>
              </div>

              {/* Open source cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {sortedOpenSourceProjects.map((project) => (
                  <ProjectOpenSourceCard key={project.name} project={project} />
                ))}
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div
            className="flex items-center gap-2 px-2 py-1"
            style={{
              borderTop: "1px solid #888",
              background: "#d4d0c8",
            }}
          >
            <div
              className="flex-1 text-[11px] text-black"
              style={{
                border: "1px solid",
                borderColor: "#888 #fff #fff #888",
                padding: "0 4px",
              }}
            >
              {orderedProjects.length} project(s)
            </div>
            <div
              className="text-[11px] text-black"
              style={{
                border: "1px solid",
                borderColor: "#888 #fff #fff #888",
                padding: "0 6px",
              }}
            >
              Ready
            </div>
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center gap-2 px-2 py-1"
        style={{
          background: "linear-gradient(to bottom, #1e5caa, #2472d8)",
          borderTop: "2px solid #fff",
          height: "32px",
        }}
      >
        {/* Start button */}
        <div
          className="flex items-center gap-1 px-2 py-1 font-bold text-white"
          style={{
            border: "2px solid",
            borderColor: "#fff #000 #000 #fff",
            borderRadius: "0",
            background: "linear-gradient(to bottom, #2d8c2d, #187618)",
            fontFamily: "Tahoma, sans-serif",
            fontSize: "11px",
          }}
        >
          <span className="text-base">⊞</span>
          Start
        </div>

        {/* Active window */}
        <div
          className="flex items-center gap-1.5 px-2 py-0.5"
          style={{
            border: "2px solid",
            borderColor: "#888 #fff #fff #888",
            background: "#d4d0c8",
            fontFamily: "Tahoma, sans-serif",
            fontSize: "11px",
          }}
        >
          <span
            className="inline-block h-3 w-3"
            style={{ background: "#d4d0c8", border: "1px solid #000" }}
          />
          Projects
        </div>

        {/* System tray spacer */}
        <div className="flex-1" />

        {/* Clock */}
        <Win2kClock />
      </div>
    </div>
  )
}
