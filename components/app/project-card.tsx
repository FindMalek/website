import Image from "next/image"
import Link from "next/link"

import {
  convertProjectStatus,
  convertProjectStatusColor,
} from "@/config/converter"
import { ProjectRo } from "@/config/schemas"

import { AspectRatio } from "@/components/ui/aspect-ratio"

function Win2kStatusBadge({ status }: { status: ProjectRo["status"] }) {
  const label = convertProjectStatus(status)
  const colorClass = convertProjectStatusColor(status)

  const dotColor =
    status === "published"
      ? "#00aa00"
      : status === "wip"
        ? "#aaaa00"
        : status === "on-hold"
          ? "#cc6600"
          : "#888888"

  return (
    <span
      className="inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-bold"
      style={{
        borderColor: "#888 #fff #fff #888",
        borderStyle: "solid",
        borderWidth: "1px",
        background: "#d4d0c8",
        color: "#000",
      }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: dotColor }}
      />
      {label}
    </span>
  )
}

export function ProjectCard({ project }: { project: ProjectRo }) {
  return (
    <Link href={project.href} className="block no-underline">
      {/* Win2000 window chrome */}
      <div
        className="w-full"
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
            {/* Window icon — tiny square */}
            <span
              className="inline-block h-3 w-3 flex-shrink-0"
              style={{ background: "#d4d0c8", border: "1px solid #000" }}
            />
            <span className="truncate text-xs font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
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

        {/* Menu bar */}
        <div
          className="flex items-center gap-4 px-2 py-0.5 text-[11px]"
          style={{
            background: "#d4d0c8",
            borderBottom: "1px solid #888",
            fontFamily: "Tahoma, sans-serif",
          }}
        >
          {["File", "View", "Help"].map((m) => (
            <span key={m} className="cursor-default select-none text-black hover:bg-[#0a246a] hover:text-white px-1">
              <u>{m[0]}</u>
              {m.slice(1)}
            </span>
          ))}
        </div>

        {/* Content area — sunken panel */}
        <div className="p-3">
          <div
            style={{
              border: "2px solid",
              borderColor: "#888 #fff #fff #888",
              background: "#fff",
              padding: "8px",
            }}
          >
            {/* Status + description row */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <p
                className="text-[12px] leading-relaxed text-black"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                {project.overview}
              </p>
              <Win2kStatusBadge status={project.status} />
            </div>

            {/* Image with sunken border */}
            <div
              style={{
                border: "2px solid",
                borderColor: "#888 #fff #fff #888",
                background: "#fff",
              }}
            >
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={project.image}
                  alt={project.name}
                  className="object-cover"
                  fill
                />
              </AspectRatio>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="flex items-center gap-2 px-2 py-1"
          style={{
            borderTop: "1px solid #888",
            background: "#d4d0c8",
            fontFamily: "Tahoma, sans-serif",
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
            Click to open project
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
    </Link>
  )
}
