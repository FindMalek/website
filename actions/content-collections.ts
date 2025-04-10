import { defineCollection, defineConfig } from "@content-collections/core"

const work = defineCollection({
  name: "work",
  directory: "../data/work",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
  }),
})

const projects = defineCollection({
  name: "projects",
  directory: "../data/projects",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
  }),
})

export default defineConfig({
  collections: [work, projects],
})
