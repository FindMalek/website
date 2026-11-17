import { fetchCoverArt } from "@/lib/navidrome"

const COVER_ID = /^[\w-]{1,100}$/

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!COVER_ID.test(id)) return new Response(null, { status: 400 })

  const cover = await fetchCoverArt(id)
  if (!cover) return new Response(null, { status: 404 })

  return new Response(cover.body, {
    headers: {
      "Content-Type": cover.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  })
}
