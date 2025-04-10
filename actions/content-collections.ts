import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMarkdown } from "@content-collections/markdown"

import { workSchema } from "@/config/schemas"

const work = defineCollection({
  name: "work",
  directory: "../data/work",
  include: "**/*.md",
  schema: () => workSchema.shape,
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document)
    return {
      ...document,
      html,
    }
  },
})

const projects = defineCollection({
  name: "projects",
  directory: "../data/projects",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document)
    return {
      ...document,
      html,
    }
  },
})

export default defineConfig({
  collections: [work, projects],
})
