import { unstable_cache } from "next/cache"
import resumeFallback from "@/data/resume.json"

import { RESUME_SLUG, RESUME_USERNAME } from "@/config/consts"

export type ResumeData = typeof resumeFallback

/**
 * Just enough of a shape check to catch a malformed/truncated response
 * before it reaches call sites that assume these fields exist (e.g.
 * stripHtml(resumeData.summary.content) in lib/chatbot-context.ts) --
 * not a full schema validation, this only guards what's actually
 * dereferenced unconditionally downstream.
 */
function isValidResumeData(data: unknown): data is ResumeData {
  if (!data || typeof data !== "object") return false
  const candidate = data as Partial<ResumeData>
  return (
    typeof candidate.basics?.name === "string" &&
    typeof candidate.summary?.content === "string" &&
    typeof candidate.sections === "object" &&
    candidate.sections !== null
  )
}

async function fetchLiveResumeData(): Promise<ResumeData | null> {
  try {
    const res = await fetch(
      `https://rxresu.me/api/openapi/resumes/${RESUME_USERNAME}/${RESUME_SLUG}`,
      { signal: AbortSignal.timeout(5000) }
    )

    if (!res.ok) {
      return null
    }

    const json = await res.json()
    return isValidResumeData(json.data) ? json.data : null
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
