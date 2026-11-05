import { getNowPlaying } from "@/lib/lodesong"

export async function GET() {
  const data = await getNowPlaying()
  return Response.json(data, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  })
}
