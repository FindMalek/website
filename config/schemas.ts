import { z } from "zod"

import { projectStatus, workType } from "@/types/enum"

export const workSchema = z.object({
  id: z.number(),
  logo: z.string(),
  logoClassName: z.string().optional(),
  company: z.string().min(1),
  position: z.string().min(1),
  overview: z.string().min(1),
  type: workType,
  startDate: z.string(),
  endDate: z.string(),
  place: z.string().min(1),
  link: z.string().url().optional(),
  href: z.string(),
})

export type WorkRo = z.infer<typeof workSchema>

export const projectSchema = z.object({
  id: z.number(),
  image: z.string(),
  name: z.string().min(1),
  overview: z.string().min(1),
  status: projectStatus,
  link: z.string().url().optional(),
  href: z.string(),
})

export type ProjectRo = z.infer<typeof projectSchema>
