import { RESUME_SLUG, RESUME_USERNAME } from "@/config/consts"
import { getResumePdfBase64 } from "@/lib/get-resume-pdf"

const FILE_NAME = "Malek-Gara-Hellal-Resume.pdf"

export async function GET(request: Request) {
  const download = new URL(request.url).searchParams.has("download")

  try {
    const pdf = Buffer.from(await getResumePdfBase64(), "base64")

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${FILE_NAME}"`,
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.warn(
      "cv.pdf: falling back to the public resume page:",
      error instanceof Error ? error.message : error
    )
    return Response.redirect(
      `https://rxresu.me/${RESUME_USERNAME}/${RESUME_SLUG}`,
      302
    )
  }
}
