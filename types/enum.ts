import { z } from "zod"

export const workType = z.enum(["full-time", "part-time", "freelance"])
export type WorkType = z.infer<typeof workType>
