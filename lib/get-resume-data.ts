import { unstable_cache } from "next/cache"

import resumeFallback from "@/data/resume.json"

import { RESUME_SLUG, RESUME_USERNAME } from "@/config/consts"

export type ResumeData = typeof resumeFallback

async function fetchLiveResumeData(): Promise<ResumeData | null> {
  try {
    const res = await fetch(
      `https://rxresu.me/api/openapi/resumes/${RESUME_USERNAME}/${RESUME_SLUG}`
    )

    if (!res.ok) {
      return null
    }

    const json = await res.json()
    return json.data as ResumeData
  } catch (error) {
    // Handled: falls back to the source-controlled snapshot below, so this
    // doesn't need to surface as a "Console Error" in Next's overlay.
    console.warn(
      "Error fetching live resume data, falling back to data/resume.json:",
      error instanceof Error ? error.message : error
    )
    return null
  }
}

/**
 * Live Reactive Resume data, cached and falling back to the source-controlled
 * data/resume.json snapshot if the RxResume API is unreachable -- the site's
 * CV content and AI chat context shouldn't go down over a third-party outage.
 * Revalidates every 6h; resume content changes far less often than that.
 */
export const getResumeData = unstable_cache(
  async (): Promise<ResumeData> => {
    const live = await fetchLiveResumeData()
    return live ?? resumeFallback
  },
  ["resume-data"],
  { revalidate: 21600 }
)
