import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import { z } from "zod"

// content-collections requires a genuine StandardSchema-compliant schema
// passed directly (no `.shape`, no function wrapper). config/schemas.ts's
// workSchema/projectSchema are built on the zod/v3 compat import (kept for
// react-hook-form + AI SDK tool inputSchema compatibility elsewhere), which
// does not implement the Standard Schema spec, so these are separate,
// content-collections-only schemas mirroring the same shape.
const workFrontmatterSchema = z.object({
  content: z.string(),
  id: z.number(),
  logo: z.string(),
  logoClassName: z.string().optional(),
  company: z.string().min(1),
  position: z.string().min(1),
  overview: z.string().min(1),
  type: z.enum(["full-time", "part-time", "freelance"]),
  startDate: z.string(),
  endDate: z.string(),
  place: z.string().min(1),
  location: z.string().optional(),
  link: z.url().optional(),
  href: z.string(),
  skills: z.array(z.string()).optional(),
})

const projectFrontmatterSchema = z.object({
  content: z.string(),
  id: z.number(),
  image: z.string(),
  name: z.string().min(1),
  overview: z.string().min(1),
  status: z.enum(["published", "wip", "on-hold", "draft"]),
  link: z.url().optional(),
  href: z.string(),
  tags: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// TODO(#66): New work entries (Sonaraem, The Fund) are intentionally not
// added here yet. Every field in workFrontmatterSchema below is required
// (company, position, overview, type, startDate, endDate, place, href), and
// `overview`/`position` render directly on the public timeline, so a stub
// entry with placeholder copy would ship fabricated-looking text to
// visitors. Add new `../data/work/*.mdx` files once real company details,
// dates, title, and a genuine overview are available - see
// data/resume.json's metadata.notes and github.com/findmalek/website/issues/66
// for the full list of what's still missing (Sonaraem, The Fund, Kenny).
const work = defineCollection({
  name: "work",
  directory: "../data/work",
  include: "**/*.mdx",
  schema: workFrontmatterSchema,
  transform: async (document, context) => {
    const html = await compileMDX(context, document)
    return {
      ...document,
      html,
    }
  },
})

const projects = defineCollection({
  name: "projects",
  directory: "../data/projects",
  include: "**/*.mdx",
  schema: projectFrontmatterSchema,
  transform: async (document, context) => {
    const html = await compileMDX(context, document)
    return {
      ...document,
      html,
    }
  },
})

export default defineConfig({
  content: [work, projects],
})
