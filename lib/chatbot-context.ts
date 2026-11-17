import { llml } from "@zenbase/llml"
import { allProjects, allWorks } from "content-collections"

import { PageContext } from "@/types"

import { ABOUT_BIO, aboutSegmentsToText } from "@/config/about"
import { BOOKS, CLIENTS, CONTRIBUTIONS, OVERVIEW_CARDS } from "@/config/consts"
import { siteConfig, TIMEZONE } from "@/config/site"
import { STACK_SECTIONS } from "@/config/stack"
import { getPostMarkdown, getPostUrl, getVisiblePosts } from "@/lib/blog"
import {
  searchKnowledgeDocuments,
  type KnowledgeDocument,
} from "@/lib/chatbot-search"
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
    .slice()
    .sort((a: Work, b: Work) => a.id - b.id)
    .map((job: Work) => ({
      position: job.position,
      company: job.company,
      type: job.type,
      place: job.place,
      location: job.location,
      period: `${job.startDate} - ${job.endDate}`,
      overview: job.overview,
      skills: job.skills,
      caseStudy: `${siteConfig.url}${job.href}`,
      link: job.link,
    }))
}

function getProjectsData() {
  return allProjects
    .filter((project: Project) => project.status !== "draft")
    .sort((a: Project, b: Project) => a.id - b.id)
    .map((project: Project) => ({
      name: project.name,
      overview: project.overview,
      status: project.status,
      tags: project.tags,
      caseStudy: `${siteConfig.url}${project.href}`,
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
      url: pullRequest.url ?? `${contribution.repo}/pull/${pullRequest.number}`,
      writeUp: pullRequest.post,
    })),
    note: contribution.archive?.note,
  }))
}

function getPersonalData() {
  return {
    bio: ABOUT_BIO.map(aboutSegmentsToText),
    facts: {
      timezone: TIMEZONE,
      recognition:
        "#1 open-source contributor in Tunisia on Gitista (https://gitista.com/search/?country=TN&handle=FindMalek)",
      githubActivity:
        "7,092 GitHub contributions lifetime, 3,057 in the last 12 months (counted 2026-10-18), and 5 merged pull requests in Databuddy, an analytics platform that has since gone closed source (the work is documented in blog posts and kept in a public fork)",
      companiesFounded: [
        "Undrstnd Labs: co-founder, then CTO (AI inference API)",
        "Endless Byte: co-founder (software agency, clients included Promolab)",
        "Artweave: co-founded clothing brand, acquired by Tunisian Design in 2023",
      ],
      otherRoles:
        "CTO at QTech AI (now Qorelo) in 2025, technical advisor at DeepMetis, contractor at 8Returns and Function03, full-time at Jobflow and Hortensia, freelancer at Digital Army",
      socials: siteConfig.links,
    },
    photosAndStories: OVERVIEW_CARDS.map((card) =>
      card.type === "text" ? `${card.text} (${card.subtext})` : card.story
    ).filter(Boolean),
    readingList: {
      description: `The "Reading list" section at the bottom of my site shows ${BOOKS.length} books. That's the count to give when asked how many books I've read or am reading`,
      count: BOOKS.length,
      books: BOOKS.map((book) => ({
        title: book.title,
        author: book.author,
        link: book.link,
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

export function describePageContext(
  pageContext?: PageContext
): string | undefined {
  if (!pageContext) return undefined

  if (pageContext.route === "/blog") {
    return "The visitor is browsing the blog index (the list of all posts)."
  }

  if (pageContext.route.startsWith("/blog/") && pageContext.slug) {
    const post = getVisiblePosts().find(
      (post) => post.status === "published" && post.href === pageContext.route
    )
    if (post) {
      return `The visitor is reading my blog post "${post.title}" (${getPostUrl(post)}). Use searchPortfolio with topic blog to retrieve passages relevant to their question.`
    }
  }

  if (pageContext.slug) {
    const work = allWorks.find((w: Work) => w.href === pageContext.route)
    if (work) {
      return `The visitor is reading the case study for my ${work.position} role at ${work.company}. Use searchPortfolio with topic work for details.`
    }

    const project = allProjects.find(
      (p: Project) => p.href === pageContext.route && p.status !== "draft"
    )
    if (project) {
      return `The visitor is reading the case study for "${project.name}". Use searchPortfolio with topic projects for details.`
    }

    return "The visitor is on a page that is not in the published knowledge index. Do not guess its contents."
  }

  if (pageContext.section) {
    return `The visitor is currently viewing the "${pageContext.section}" section of the homepage.`
  }

  return "The visitor is currently viewing the top of the homepage (hero section)."
}

export async function generateChatbotContext() {
  const resumeData = await getResumeData()
  const personal = getPersonalData()
  const context = {
    professionalBackground: {
      summary: stripHtml(resumeData.summary.content).slice(0, 1200),
      contact: {
        email: resumeData.basics.email,
        location: resumeData.basics.location,
        website: resumeData.basics.website.url,
        linkedin: "https://www.linkedin.com/in/findmalek/",
        github: "https://github.com/findmalek",
        twitter: "https://x.com/foundmalek",
        birthdate: "July 31, 2001",
      },
      experience: getExperienceData(resumeData).map((role) => ({
        position: role.position,
        company: role.company,
        period: role.period,
        location: role.location,
      })),
      languages: getLanguagesData(resumeData),
    },
    workExperience: getWorkExperienceData().map((work) => ({
      ...work,
      overview: work.overview.slice(0, 250),
    })),
    projects: getProjectsData().map((project) => ({
      ...project,
      overview: project.overview.slice(0, 250),
    })),
    blogPosts: getVisiblePosts()
      .filter((post) => post.status === "published")
      .map((post) => ({
        title: post.title,
        url: getPostUrl(post),
        tags: post.tags,
      })),
    personal: {
      bio: personal.bio,
      facts: personal.facts,
      bookCount: BOOKS.length,
      spotifyProfile: siteConfig.links.spotify,
    },
    availableDetails: KNOWLEDGE_TOPICS,
  }

  return llml(context)
}

export const KNOWLEDGE_TOPICS = [
  "projects",
  "work",
  "blog",
  "about",
  "books",
  "music",
  "resume",
  "stack",
  "contributions",
] as const

export async function searchPortfolio(
  query: string,
  topics: (typeof KNOWLEDGE_TOPICS)[number][]
) {
  const documents: KnowledgeDocument[] = []
  const add = (title: string, url: string, data: unknown) => {
    documents.push({ title, url, content: llml(data) })
  }

  if (topics.includes("projects")) {
    for (const project of allProjects.filter(
      (project) => project.status !== "draft"
    )) {
      documents.push({
        title: project.name,
        url: `${siteConfig.url}${project.href}`,
        keywords: project.tags,
        content: `${project.overview}\n\n${project.content}`,
      })
    }
  }
  if (topics.includes("work")) {
    for (const work of allWorks) {
      documents.push({
        title: `${work.company} — ${work.position}`,
        url: `${siteConfig.url}${work.href}`,
        keywords: work.skills,
        content: `${work.overview}\n\n${work.content}`,
      })
    }
  }
  if (topics.includes("blog")) {
    for (const post of getVisiblePosts().filter(
      (post) => post.status === "published"
    )) {
      documents.push({
        title: post.title,
        url: getPostUrl(post),
        keywords: post.tags,
        content: getPostMarkdown(post),
      })
    }
  }
  const personal = getPersonalData()
  if (topics.includes("about")) {
    add(
      "About Malek: biography, companies, photos and stories",
      `${siteConfig.url}/#about`,
      {
        bio: personal.bio,
        facts: personal.facts,
        photosAndStories: personal.photosAndStories,
        companiesIveWorkedWith: personal.companiesIveWorkedWith,
      }
    )
  }
  if (topics.includes("books")) {
    add(
      "Books and reading list",
      `${siteConfig.url}/#about`,
      personal.readingList
    )
  }
  if (topics.includes("music")) {
    const playlists = await getUserPlaylists(20, 0)
    add("Music and Spotify playlists", siteConfig.links.spotify, {
      spotifyProfile: siteConfig.links.spotify,
      playlists: playlists.items.map((playlist) => ({
        name: playlist.name,
        url: playlist.external_urls.spotify,
      })),
      note: playlists.items.length
        ? undefined
        : "Playlist details are unavailable; do not invent names or genres.",
    })
  }
  if (topics.includes("resume")) {
    const resume = await getResumeData()
    add(
      "Resume CV: profile, skills, languages, education and awards",
      siteConfig.links.resume,
      {
        summary: stripHtml(resume.summary.content),
        skills: getSkillsData(resume),
        languages: getLanguagesData(resume),
        education: getEducationData(resume),
        awards: getAwardsData(resume),
      }
    )
    for (const role of getExperienceData(resume)) {
      add(`${role.company} ${role.position}`, siteConfig.links.resume, role)
    }
  }
  if (topics.includes("stack")) {
    for (const section of getTechStackData()) {
      add(`Tech stack: ${section.section}`, `${siteConfig.url}/#stack`, section)
    }
  }
  if (topics.includes("contributions")) {
    for (const contribution of getOpenSourceContributionsData()) {
      add(
        `Open source contributions: ${contribution.repository}`,
        contribution.repository,
        contribution
      )
    }
  }

  return {
    matches: searchKnowledgeDocuments(documents, query),
    note: "These are relevant excerpts, not complete documents. Use only stated facts; try more specific keywords or another topic if needed.",
  }
}
