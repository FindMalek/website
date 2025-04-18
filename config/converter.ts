import { ProjectStatus, ProjectType, ToolName, WorkType } from "@/types/enum"

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

export const convertProjectStatus = (status: ProjectStatus) => {
  switch (status) {
    case "wip":
      return "Work In Progress"
    case "active":
      return "Active"
    case "inactive":
      return "Inactive"
    case "archived":
      return "Archived"
    case "draft":
      return "Draft"
    case "on-hold":
      return "On Hold"
  }
}

export const convertProjectStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "wip":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "inactive":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    case "archived":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case "draft":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    case "on-hold":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
  }
}

export const convertToolName = (name: ToolName) => {
  switch (name) {
    case "saveEmail":
      return "Save Email"
    case "scheduleMeeting":
      return "Schedule Meeting"
    case "generatePricing":
      return "Generate Pricing"
    case "getResume":
      return "View Resume"
  }
}

export const convertProjectType = (type: ProjectType) => {
  switch (type) {
    case "website":
      return "Static Website"
    case "automation":
      return "Automation Scripts"
    case "ecommerce":
      return "E-commerce Store"
    case "webapp":
      return "Web Application"
    case "other":
      return "Other"
  }
}
