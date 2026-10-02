import { unstable_cache } from "next/cache"

import type { Activity } from "@/components/app/contribution-graph"

type GitHubContributionsResponse = {
  contributions: Activity[]
}

const fetchCachedContributions = unstable_cache(
  async (username: string) => {
    const res = await fetch(
      `${process.env.GITHUB_CONTRIBUTIONS_API_URL || `https://github-contributions-api.jogruber.de`}/v4/${username}?y=last`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) {
      return []
    }
    const data = (await res.json()) as GitHubContributionsResponse
    return data.contributions ?? []
  },
  ["github-contributions"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)

// The catch sits outside unstable_cache so a timeout isn't cached for a day.
// Without it, a slow third-party API rejects the promise the homepage passes
// to use() and fails the whole prerender (and with it the deploy).
export async function getCachedContributions(
  username: string
): Promise<Activity[]> {
  try {
    return await fetchCachedContributions(username)
  } catch (error) {
    console.warn(
      "Error fetching GitHub contributions, rendering an empty graph:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}
