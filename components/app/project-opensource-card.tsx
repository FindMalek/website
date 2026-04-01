"use client"

import Link from "next/link"

import { OpenSourceProject } from "@/types"

import { Icons } from "@/components/shared/icons"

export function ProjectOpenSourceCard({
  project,
}: {
  project: OpenSourceProject
}) {
  const formattedStars =
    project.stars >= 1000
      ? `${(project.stars / 1000).toFixed(1)}k`
      : project.stars.toString()

  return (
    <Link
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full no-underline"
    >
      <div
        className="flex h-full flex-col"
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
              className="inline-block h-3 w-3 flex-shrink-0"
              style={{ background: "#d4d0c8", border: "1px solid #000" }}
            />
            <span
              className="truncate text-xs font-bold text-white"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              {project.name}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {["_", "□", "×"].map((c) => (
              <span
                key={c}
                className="flex h-4 w-5 items-center justify-center text-[10px] font-bold text-black"
                style={{
                  background: "#d4d0c8",
                  border: "1px solid",
                  borderColor: "#fff #888 #888 #fff",
                  fontFamily: "Tahoma, sans-serif",
                  lineHeight: 1,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-3">
          <div
            style={{
              border: "2px solid",
              borderColor: "#888 #fff #fff #888",
              background: "#fff",
              padding: "8px",
              flex: 1,
            }}
          >
            <p
              className="line-clamp-3 text-[12px] leading-relaxed text-black"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              {project.description}
            </p>
          </div>

          {/* Footer row */}
          <div
            className="flex items-center justify-between"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            {project.language && (
              <div className="flex items-center gap-1.5 text-[11px] text-black">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: project.languageColor, border: "1px solid #888" }}
                />
                {project.language}
              </div>
            )}
            <div
              className="flex items-center gap-1 text-[11px] text-black"
              style={{
                border: "2px solid",
                borderColor: "#888 #fff #fff #888",
                padding: "1px 6px",
                background: "#d4d0c8",
              }}
            >
              <Icons.star className="h-3 w-3 fill-amber-500 stroke-amber-600" />
              <span className="font-bold">{formattedStars}</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="px-2 py-1"
          style={{
            borderTop: "1px solid #888",
            background: "#d4d0c8",
            fontFamily: "Tahoma, sans-serif",
          }}
        >
          <div
            className="text-[11px] text-black"
            style={{
              border: "1px solid",
              borderColor: "#888 #fff #fff #888",
              padding: "0 4px",
            }}
          >
            GitHub Repository ↗
          </div>
        </div>
      </div>
    </Link>
  )
}
