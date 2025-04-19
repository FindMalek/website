import { z } from "zod"

import { projectStatus, projectType, workType } from "@/types/enum"

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

export const emailFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(1, { message: "Message is required" }),
})

export type EmailFormValues = z.infer<typeof emailFormSchema>

export const meetingSchedulerSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  duration: z.enum(["15", "30"], {
    required_error: "Please select meeting duration",
  }),
})

export type MeetingSchedulerValues = z.infer<typeof meetingSchedulerSchema>

export const pricingEstimatorSchema = z.object({
  projectType: projectType,
  complexity: z.number().min(0).max(100),
  timeframe: z.number().min(0).max(100),
  selectedFeatures: z.array(z.string()),
})

export type PricingEstimatorValues = z.infer<typeof pricingEstimatorSchema>
