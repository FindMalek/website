import { getCurrentTrack } from "@/lib/navidrome"

export async function GET() {
  const track = await getCurrentTrack()

  return Response.json(track, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  })
}
