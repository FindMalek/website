import { unstable_cache } from "next/cache"

import { RESUME_SLUG } from "@/config/consts"

const RXRESUME_API = "https://rxresu.me/api/openapi"
const TIMEOUT_MS = 15000

async function fetchResumePdfBase64(): Promise<string> {
  const apiKey = process.env.RXRESUME_API_KEY
  if (!apiKey) throw new Error("RXRESUME_API_KEY is not set")

  const headers = { "x-api-key": apiKey }

  const listRes = await fetch(`${RXRESUME_API}/resumes`, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!listRes.ok) throw new Error(`resume list failed: ${listRes.status}`)

  const resumes = (await listRes.json()) as { id: string; slug: string }[]
  const id = resumes.find((resume) => resume.slug === RESUME_SLUG)?.id
  if (!id) throw new Error(`no resume with slug ${RESUME_SLUG}`)

  const pdfRes = await fetch(`${RXRESUME_API}/resumes/${id}/exports/pdf`, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!pdfRes.ok) throw new Error(`pdf export failed: ${pdfRes.status}`)

  const bytes = Buffer.from(await pdfRes.arrayBuffer())
  if (bytes.subarray(0, 4).toString() !== "%PDF") {
    throw new Error("pdf export did not return a PDF")
  }
  return bytes.toString("base64")
}

/**
 * The exact PDF Reactive Resume renders for the master resume. Throws on any
 * failure so a bad response is never cached; the route falls back instead.
 * Same 6h revalidate as the resume json.
 */
export const getResumePdfBase64 = unstable_cache(
  fetchResumePdfBase64,
  ["resume-pdf"],
  { revalidate: 21600 }
)
