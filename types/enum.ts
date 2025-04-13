import { z } from "zod"

export const workType = z.enum(["full-time", "part-time", "freelance"])
export type WorkType = z.infer<typeof workType>

export const projectStatus = z.enum([
  "wip",
  "active",
  "inactive",
  "archived",
  "draft",
])
export type ProjectStatus = z.infer<typeof projectStatus>
