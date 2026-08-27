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

// TODO(#66): New work entries (Harmonia, The Fund) are intentionally not
// added here yet. Every field in workFrontmatterSchema below is required
// (company, position, overview, type, startDate, endDate, place, href), and
// `overview`/`position` render directly on the public timeline, so a stub
// entry with placeholder copy would ship fabricated-looking text to
// visitors. Add new `../data/work/*.mdx` files once real company details,
// dates, title, and a genuine overview are available - see
// data/resume.json's metadata.notes and github.com/findmalek/website/issues/66
// for the full list of what's still missing (Harmonia, The Fund, Kenny).

// The MDX body is the full recommendation text (mirrors how work/project case
// studies use their body as the long-form write-up) -- `excerpt` is the short
// pull-quote used on work-experience pages and the landing marquee, `content`
// carries the raw MDX so the full recommendation page can render it in full.
const recommendationFrontmatterSchema = z.object({
  content: z.string(),
  id: z.number(),
  href: z.string(),
  recommenderName: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  companyLogo: z.string().optional(),
  photo: z.string().optional(),
  excerpt: z.string().min(1),
  date: z.string(),
  relationship: z.enum(["manager", "coworker", "client", "collaborator"]),
  source: z.enum(["linkedin", "x", "email", "message", "other"]),
  linkedinUrl: z.url().optional(),
  otherLinks: z
    .array(z.object({ label: z.string().min(1), url: z.url() }))
    .optional(),
  signatureImage: z.string().optional(),
  relatedWorkHref: z.string().optional(),
  // Marks entries that are NOT real, approved recommendations -- structural
  // placeholders only. Must never be unset for fabricated/unapproved content.
  isPlaceholder: z.boolean().optional(),
})

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

const recommendations = defineCollection({
  name: "recommendations",
  directory: "../data/recommendations",
  include: "**/*.mdx",
  schema: recommendationFrontmatterSchema,
  transform: async (document, context) => {
    const html = await compileMDX(context, document)
    return {
      ...document,
      html,
    }
  },
})

export default defineConfig({
  content: [work, projects, recommendations],
})
