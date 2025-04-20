import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"

import { projectSchema, workSchema } from "@/config/schemas"

const work = defineCollection({
  name: "work",
  directory: "../data/work",
  include: "**/*.mdx",
  schema: () => workSchema.shape,
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
  schema: () => projectSchema.shape,
  transform: async (document, context) => {
    const html = await compileMDX(context, document)
    return {
      ...document,
      html,
    }
  },
})

export default defineConfig({
  collections: [work, projects],
})
