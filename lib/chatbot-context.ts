import resumeData from "@/data/resume.json"
import { allProjects, allWorks } from "content-collections"

import { STACK_SECTIONS } from "@/config/stack"

type Project = (typeof allProjects)[number]
type Work = (typeof allWorks)[number]

/**
 * Formats resume skills into a readable string
 */
function formatSkills() {
  const skills = resumeData.sections.skills.items
  return skills
    .map((skill) => `- **${skill.name}**: ${skill.description}`)
    .join("\n")
}

/**
 * Formats resume experience into a readable string
 */
function formatExperience() {
  const experiences = resumeData.sections.experience.items
  return experiences
    .map(
      (exp) =>
        `- **${exp.position}** at **${exp.company}** (${exp.date})
  Location: ${exp.location}
  ${exp.summary
    .replace(/<[^>]*>/g, "")
    .replace(/\n+/g, " ")
    .trim()}`
    )
    .join("\n\n")
}

/**
 * Formats resume education into a readable string
 */
function formatEducation() {
  const education = resumeData.sections.education.items
  return education
    .map(
      (edu) =>
        `- **${edu.studyType} in ${edu.area}** at **${edu.institution}**
  Date: ${edu.date}
  Score: ${edu.score}
  ${edu.summary
    .replace(/<[^>]*>/g, "")
    .replace(/\n+/g, " ")
    .trim()}`
    )
    .join("\n\n")
}

/**
 * Formats resume awards into a readable string
 */
function formatAwards() {
  const awards = resumeData.sections.awards.items
  return awards
    .map(
      (award) =>
        `- **${award.title}** by ${award.awarder} (${award.date})
  ${award.summary
    .replace(/<[^>]*>/g, "")
    .replace(/\n+/g, " ")
    .trim()}`
    )
    .join("\n\n")
}

/**
 * Formats resume languages into a readable string
 */
function formatLanguages() {
  const languages = resumeData.sections.languages.items
  return languages
    .map((lang) => `- **${lang.name}**: ${lang.description}`)
    .join("\n")
}

/**
 * Formats projects from content collections into a readable string
 */
function formatProjects() {
  return allProjects
    .sort((a: Project, b: Project) => a.id - b.id)
    .map(
      (project: Project) =>
        `### ${project.name}
${project.overview}
${project.link ? `Link: ${project.link}` : ""}`
    )
    .join("\n\n")
}

/**
 * Formats work experience from content collections into a readable string
 */
function formatWorkExperience() {
  return allWorks
    .sort((a: Work, b: Work) => a.id - b.id)
    .map(
      (job: Work) =>
        `### ${job.position} at ${job.company}
Type: ${job.type} | Place: ${job.place}${job.location ? ` | Location: ${job.location}` : ""}
Period: ${job.startDate} - ${job.endDate}
${job.overview}
${job.link ? `Link: ${job.link}` : ""}`
    )
    .join("\n\n")
}

/**
 * Formats tech stack from config into a readable string
 */
function formatStack() {
  return STACK_SECTIONS.map(
    (section) =>
      `**${section.title}:**
${section.items.map((item) => `- ${item.title}: ${item.description}`).join("\n")}`
  ).join("\n\n")
}

/**
 * Generates the complete context for the chatbot
 */
export function generateChatbotContext() {
  return `
## DETAILED PROFESSIONAL BACKGROUND

### Summary
${resumeData.sections.summary.content
  .replace(/<[^>]*>/g, "")
  .replace(/\n+/g, " ")
  .trim()}

### Contact Information
- Email: ${resumeData.basics.email}
- Phone: ${resumeData.basics.phone}
- Location: ${resumeData.basics.location}
- Website: ${resumeData.basics.url.href}
- LinkedIn: https://www.linkedin.com/in/findmalek/
- GitHub: https://github.com/findmalek
- Twitter: https://x.com/foundmalek

### Education
${formatEducation()}

### Professional Experience
${formatExperience()}

### Awards & Recognition
${formatAwards()}

### Technical Skills
${formatSkills()}

### Languages
${formatLanguages()}

## DETAILED WORK EXPERIENCE

${formatWorkExperience()}

## PROJECT PORTFOLIO

${formatProjects()}

## TECHNOLOGY STACK & TOOLS

${formatStack()}
`.trim()
}
