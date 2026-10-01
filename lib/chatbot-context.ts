import { llml } from "@zenbase/llml"
import { allProjects, allWorks } from "content-collections"

import { PageContext } from "@/types"

import { ABOUT_BIO, aboutSegmentsToText } from "@/config/about"
import { BOOKS, CLIENTS, CONTRIBUTIONS, OVERVIEW_CARDS } from "@/config/consts"
import { siteConfig, TIMEZONE } from "@/config/site"
import { STACK_SECTIONS } from "@/config/stack"
import {
  getPostBySlug,
  getPostMarkdown,
  getPostUrl,
  getVisiblePosts,
} from "@/lib/blog"
import { getResumeData, type ResumeData } from "@/lib/get-resume-data"

import { getUserPlaylists } from "@/actions/spotify"

type Project = (typeof allProjects)[number]
type Work = (typeof allWorks)[number]
type SkillItem = { name: string; keywords: string[] }
type LanguageItem = { language: string; fluency: string }

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\n+/g, " ")
    .trim()
}

function getExperienceData(resumeData: ResumeData) {
  return resumeData.sections.experience.items.map((exp) => ({
    position: exp.position,
    company: exp.company,
    period: exp.period,
    location: exp.location,
    description: stripHtml(exp.description),
  }))
}

function getEducationData(resumeData: ResumeData) {
  return resumeData.sections.education.items.map((edu) => ({
    degree: edu.degree,
    area: edu.area,
    school: edu.school,
    period: edu.period,
    grade: edu.grade,
    description: stripHtml(edu.description),
  }))
}

function getAwardsData(resumeData: ResumeData) {
  return resumeData.sections.awards.items.map((award) => ({
    title: award.title,
    awarder: award.awarder,
    date: award.date,
    description: stripHtml(award.description),
  }))
}

function getSkillsData(resumeData: ResumeData) {
  const skills = resumeData.sections.skills.items as SkillItem[]
  return skills.map((skill) => ({
    name: skill.name,
    keywords: (skill.keywords ?? []).join(", "),
  }))
}

function getLanguagesData(resumeData: ResumeData) {
  const languages = resumeData.sections.languages.items as LanguageItem[]
  return languages.map((lang) => ({
    name: lang.language ?? "",
    fluency: lang.fluency ?? "",
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

function getOpenSourceContributionsData() {
  return CONTRIBUTIONS.filter(
    (contribution) => contribution.pullRequests.length > 0
  ).map((contribution) => ({
    repository: contribution.repo,
    mergedPullRequests: contribution.pullRequests.map((pullRequest) => ({
      title: pullRequest.title,
      url: `${contribution.repo}/pull/${pullRequest.number}`,
      writeUp: pullRequest.post,
    })),
  }))
}

async function getPersonalData() {
  const playlists = await getUserPlaylists(20, 0)

  return {
    bio: ABOUT_BIO.map(aboutSegmentsToText),
    facts: {
      timezone: TIMEZONE,
      recognition:
        "#1 open-source contributor in Tunisia (https://gitista.com/search/?country=TN&handle=FindMalek)",
      socials: siteConfig.links,
    },
    photosAndStories: OVERVIEW_CARDS.map((card) =>
      card.type === "text" ? `${card.text} (${card.subtext})` : card.story
    ).filter(Boolean),
    booksImReading: BOOKS.map((book) => ({
      title: book.title,
      author: book.author,
      link: book.link,
    })),
    music: {
      spotifyProfile: siteConfig.links.spotify,
      playlists: playlists.items.map((playlist) => ({
        name: playlist.name,
        url: playlist.external_urls.spotify,
      })),
    },
    companiesIveWorkedWith: CLIENTS.map((client) =>
      client.href ? `${client.name} (${client.href})` : client.name
    ),
  }
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
 * Describes what the visitor is currently looking at, in a form the model
 * can naturally reference ("I see you're checking out my Zero Locker case
 * study..."). Undefined when no page context was sent (e.g. an older
 * client, or a direct API call).
 */
function describePageContext(pageContext?: PageContext): string | undefined {
  if (!pageContext) return undefined

  if (pageContext.route === "/blog") {
    return "The visitor is browsing the blog index (the list of all posts)."
  }

  if (pageContext.route.startsWith("/blog/") && pageContext.slug) {
    const post = getPostBySlug(pageContext.slug)
    if (post) {
      return `The visitor is currently reading my blog post "${post.title}". Answer questions about it from its full text below, and quote it rather than guessing.\n\n${getPostMarkdown(post)}`
    }
  }

  if (pageContext.slug) {
    const work = allWorks.find((w: Work) => w.href === pageContext.route)
    if (work) {
      return `The visitor is currently reading the case study for the ${work.position} role at ${work.company}.`
    }

    const project = allProjects.find(
      (p: Project) => p.href === pageContext.route
    )
    if (project) {
      return `The visitor is currently reading the case study for the "${project.name}" project.`
    }

    return `The visitor is currently reading a case study page (${pageContext.slug}).`
  }

  if (pageContext.section) {
    return `The visitor is currently viewing the "${pageContext.section}" section of the homepage.`
  }

  return "The visitor is currently viewing the top of the homepage (hero section)."
}

/**
 * Generates the complete context for the chatbot using LLML
 * Transforms structured data into VibeXML optimized for AI attention
 */
export async function generateChatbotContext(pageContext?: PageContext) {
  const resumeData = await getResumeData()

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
      education: getEducationData(resumeData),
      experience: getExperienceData(resumeData),
      awards: getAwardsData(resumeData),
      skills: getSkillsData(resumeData),
      languages: getLanguagesData(resumeData),
    },
    workExperience: getWorkExperienceData(),
    projects: getProjectsData(),
    openSourceContributions: getOpenSourceContributionsData(),
    blogPosts: getVisiblePosts().map((post) => ({
      title: post.title,
      url: getPostUrl(post),
      excerpt: post.excerpt,
    })),
    techStack: getTechStackData(),
    personal: await getPersonalData(),
    ...(describePageContext(pageContext)
      ? { currentContext: describePageContext(pageContext) }
      : {}),
  }

  return llml(context)
}
