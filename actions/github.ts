"use server"

import { env } from "@/env"
import { OpenSourceProject } from "@/types"

import { LANGUAGES_COLORS } from "@/config/consts"

interface GraphQLError {
  type: string
  path: string[]
  extensions: Record<string, unknown>
  locations: Array<Record<string, unknown>>
  message: string
}

export async function getRepoInfo(
  repoUrl: string
): Promise<OpenSourceProject | null> {
  try {
    const urlParts = repoUrl.split("/")
    const owner = urlParts[urlParts.length - 2]
    const repo = urlParts[urlParts.length - 1]

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 3600 }, // Cache responses for 1 hour (3600 seconds)
    })

    if (!response.ok) {
      throw new Error(
        `${response.status} Network response was not ok: ${apiUrl}`,
        {
          cause: response,
        }
      )
    }

    const repoData = await response.json()

    const repoInfo: OpenSourceProject = {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      language: repoData.language || null,
      languageColor: repoData.language
        ? LANGUAGES_COLORS[repoData.language as keyof typeof LANGUAGES_COLORS]
        : "#701516",
      url: repoData.html_url,
    }

    return repoInfo
  } catch (error) {
    console.error("Error fetching repository info:", error)
    return null
  }
}

// Modified function using GraphQL API to handle forbidden repositories
export async function getMultipleRepoInfo(
  repoUrls: string[]
): Promise<OpenSourceProject[]> {
  if (!repoUrls || repoUrls.length === 0) {
    return []
  }

  // First try using GraphQL for all repositories
  try {
    const repoDetails = repoUrls.map((url, index) => {
      const parts = url.split("/")
      const owner = parts[parts.length - 2]
      const repo = parts[parts.length - 1]
      return { alias: `repo${index}`, owner, repo, url }
    })

    const query = `
      query {
        ${repoDetails
          .map(
            ({ alias, owner, repo }) => `
          ${alias}: repository(owner: "${owner}", name: "${repo}") {
            name
            description
            stargazerCount
            primaryLanguage {
              name
              color
            }
            url
          }
        `
          )
          .join("\n")}
      }
    `

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // Cache responses for 1 hour
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `${response.status} Network response was not ok: ${errorText}`
      )
    }

    const jsonResponse = await response.json()
    const data = jsonResponse.data || {}

    // Identify accessible and forbidden repositories
    const accessibleRepos: OpenSourceProject[] = []
    const forbiddenRepos: Array<{ owner: string; repo: string; url: string }> =
      []

    if (jsonResponse.errors) {
      console.error("GraphQL Errors:", jsonResponse.errors)

      // Track repositories with access errors
      jsonResponse.errors.forEach((error: GraphQLError) => {
        if (error.type === "FORBIDDEN" && error.path && error.path[0]) {
          const aliasWithError = error.path[0]
          const repoInfo = repoDetails.find((r) => r.alias === aliasWithError)
          if (repoInfo) {
            forbiddenRepos.push({
              owner: repoInfo.owner,
              repo: repoInfo.repo,
              url: repoInfo.url,
            })
          }
        }
      })
    }

    // Process successful responses
    repoDetails.forEach(({ alias }) => {
      const repoData = data[alias]
      if (!repoData) return // Skip if no data (likely forbidden)

      accessibleRepos.push({
        name: repoData.name,
        description: repoData.description,
        stars: repoData.stargazerCount,
        language: repoData.primaryLanguage?.name || null,
        languageColor:
          repoData.primaryLanguage?.color ||
          (repoData.primaryLanguage?.name
            ? LANGUAGES_COLORS[
                repoData.primaryLanguage.name as keyof typeof LANGUAGES_COLORS
              ]
            : null) ||
          "#701516",
        url: repoData.url,
      })
    })

    // Fetch forbidden repositories individually using REST API as fallback
    if (forbiddenRepos.length > 0) {
      console.log(
        `Trying to fetch ${forbiddenRepos.length} forbidden repositories using REST API as fallback`
      )

      const fallbackResults = await Promise.allSettled(
        forbiddenRepos.map(async ({ url }) => getRepoInfo(url))
      )

      fallbackResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          accessibleRepos.push(result.value)
        }
      })
    }

    return accessibleRepos
  } catch (error) {
    console.error("Error in GraphQL request, falling back to REST API:", error)

    // If GraphQL completely fails, fall back to REST API for all repositories
    const results = await Promise.allSettled(repoUrls.map(getRepoInfo))
    return results
      .filter(
        (result): result is PromiseFulfilledResult<OpenSourceProject> =>
          result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value)
  }
}
