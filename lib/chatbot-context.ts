import resumeData from "@/data/resume.json"
import { llml } from "@zenbase/llml"
import { allProjects, allWorks } from "content-collections"

import { STACK_SECTIONS } from "@/config/stack"

type Project = (typeof allProjects)[number]
type Work = (typeof allWorks)[number]
type SkillItem = { name: string; description: string }
type LanguageItem = { name: string; description: string }

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\n+/g, " ")
    .trim()
}

function getExperienceData() {
  return resumeData.sections.experience.items.map((exp) => ({
    position: exp.position,
    company: exp.company,
    period: exp.period,
    location: exp.location,
    description: stripHtml(exp.description),
  }))
}

function getEducationData() {
  return resumeData.sections.education.items.map((edu) => ({
    degree: edu.degree,
    area: edu.area,
    school: edu.school,
    period: edu.period,
    grade: edu.grade,
    description: stripHtml(edu.description),
  }))
}

function getAwardsData() {
  return resumeData.sections.awards.items.map((award) => ({
    title: award.title,
    awarder: award.awarder,
    date: award.date,
    description: stripHtml(award.description),
  }))
}

function getSkillsData() {
  const skills = resumeData.sections.skills.items as SkillItem[]
  return skills.map((skill) => ({
    name: skill.name,
    description: skill.description,
  }))
}

function getLanguagesData() {
  const languages = resumeData.sections.languages.items as LanguageItem[]
  return languages.map((lang) => ({
    name: lang.name,
    description: lang.description,
  }))
}

function getWorkExperienceData() {
  return allWorks
    .sort((a: Work, b: Work) => a.id - b.id)
    .map((job: Work) => ({
      position: job.position,
      company: job.company,
      type: job.type,
      place: job.place,
      location: job.location,
      period: `${job.startDate} - ${job.endDate}`,
      overview: job.overview,
      link: job.link,
    }))
}

function getProjectsData() {
  return allProjects
    .sort((a: Project, b: Project) => a.id - b.id)
    .map((project: Project) => ({
      name: project.name,
      overview: project.overview,
      link: project.link,
    }))
}

function getTechStackData() {
  return STACK_SECTIONS.map((section) => ({
    section: section.title,
    items: section.items.map((item) => ({
      title: item.title,
      description: item.description,
    })),
  }))
}

/**
 * Generates the complete context for the chatbot using LLML
 * Transforms structured data into VibeXML optimized for AI attention
 */
export function generateChatbotContext() {
  const context = {
    professionalBackground: {
      summary: stripHtml(resumeData.summary.content),
      contact: {
        email: resumeData.basics.email,
        phone: resumeData.basics.phone,
        location: resumeData.basics.location,
        website: resumeData.basics.website.url,
        linkedin: "https://www.linkedin.com/in/findmalek/",
        github: "https://github.com/findmalek",
        twitter: "https://x.com/foundmalek",
        birthdate: "July 31, 2001",
      },
      education: getEducationData(),
      experience: getExperienceData(),
      awards: getAwardsData(),
      skills: getSkillsData(),
      languages: getLanguagesData(),
    },
    workExperience: getWorkExperienceData(),
    projects: getProjectsData(),
    techStack: getTechStackData(),
  }

  return llml(context)
}
