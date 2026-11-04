export const dynamic = "force-dynamic"

export function GET(request: Request): Response {
  return Response.json(
    { country: request.headers.get("x-vercel-ip-country") },
    { headers: { "Cache-Control": "private, no-store" } }
  )
}
