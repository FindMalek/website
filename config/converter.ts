import { WorkType } from "@/types/enum"

export const convertWorkType = (type: WorkType) => {
  switch (type) {
    case "full-time":
      return "Full Time"
    case "part-time":
      return "Part Time"
    case "freelance":
      return "Freelance"
  }
}
