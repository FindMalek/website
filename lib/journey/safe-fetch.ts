import { lookup } from "node:dns/promises"
import http from "node:http"
import https from "node:https"
import { isIP } from "node:net"

const TIMEOUT_MS = 6000
const MAX_BYTES = 1_500_000
const MAX_REDIRECTS = 3

export class PageFetchError extends Error {}

function isPrivateV4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number)
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  )
}

function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 4) return isPrivateV4(ip)
  const lower = ip.toLowerCase()
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return isPrivateV4(mapped[1])
  return (
    lower === "::" ||
    lower === "::1" ||
    lower.startsWith("fc") ||
    lower.startsWith("fd") ||
    lower.startsWith("fe8") ||
    lower.startsWith("fe9") ||
    lower.startsWith("fea") ||
    lower.startsWith("feb") ||
    lower.startsWith("ff")
  )
}

async function resolvePublicAddress(
  hostname: string
): Promise<{ address: string; family: number }> {
  const bare = hostname.replace(/^\[|\]$/g, "")
  if (/^localhost$|\.localhost$|\.local$|\.internal$/i.test(bare)) {
    throw new PageFetchError("blocked host")
  }
  const records = isIP(bare)
    ? [{ address: bare, family: isIP(bare) }]
    : await lookup(bare, { all: true })
  if (
    records.length === 0 ||
    records.some((r) => isPrivateAddress(r.address))
  ) {
    throw new PageFetchError("blocked host")
  }
  return records[0]
}

function requestOnce(
  url: URL,
  target: { address: string; family: number }
): Promise<{ status: number; location?: string; body: string }> {
  const client = url.protocol === "https:" ? https : http
  return new Promise((resolve, reject) => {
    const req = client.request(
      url,
      {
        method: "GET",
        headers: {
          "user-agent": "findmalek-interview-mode/1.0",
          accept: "text/html,text/plain;q=0.9",
        },
        // Pins the socket to the address that was checked, so DNS cannot change it later.
        lookup: (_host, options, callback) => {
          if (options.all) {
            callback(null, [target], undefined)
          } else {
            callback(null, target.address, target.family)
          }
        },
      },
      (res) => {
        const status = res.statusCode ?? 0
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume()
          resolve({ status, location: res.headers.location, body: "" })
          return
        }
        const type = String(res.headers["content-type"] ?? "")
        if (!/text\/(html|plain)|application\/(xhtml|ld\+json)/i.test(type)) {
          res.resume()
          reject(new PageFetchError("unsupported content type"))
          return
        }
        const chunks: Buffer[] = []
        let size = 0
        res.on("data", (chunk: Buffer) => {
          size += chunk.length
          if (size > MAX_BYTES) {
            req.destroy()
            reject(new PageFetchError("page too large"))
            return
          }
          chunks.push(chunk)
        })
        res.on("end", () =>
          resolve({ status, body: Buffer.concat(chunks).toString("utf8") })
        )
        res.on("error", reject)
      }
    )
    req.setTimeout(TIMEOUT_MS, () => req.destroy(new PageFetchError("timeout")))
    req.on("error", reject)
    req.end()
  })
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|head)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<\/(p|div|li|h[1-6]|br|tr)>|<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim()
}

function jobPostingFromJsonLd(html: string): string | undefined {
  const blocks = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )
  for (const block of blocks) {
    try {
      const parsed: unknown = JSON.parse(block[1])
      const list = Array.isArray(parsed) ? parsed : [parsed]
      for (const item of list) {
        if (
          item &&
          typeof item === "object" &&
          "@type" in item &&
          item["@type"] === "JobPosting"
        ) {
          const title = "title" in item ? String(item.title) : ""
          const description =
            "description" in item ? htmlToText(String(item.description)) : ""
          return `${title}\n${description}`.trim()
        }
      }
    } catch {
      continue
    }
  }
  return undefined
}

export async function fetchPageText(input: string): Promise<string> {
  let current = new URL(input)

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (current.protocol !== "http:" && current.protocol !== "https:") {
      throw new PageFetchError("only http and https")
    }
    if (current.username || current.password) {
      throw new PageFetchError("credentials in url")
    }
    if (current.port && current.port !== "80" && current.port !== "443") {
      throw new PageFetchError("port not allowed")
    }

    const target = await resolvePublicAddress(current.hostname)
    const response = await requestOnce(current, target)

    if (response.location) {
      current = new URL(response.location, current)
      continue
    }
    if (response.status !== 200) throw new PageFetchError("bad status")

    return jobPostingFromJsonLd(response.body) ?? htmlToText(response.body)
  }

  throw new PageFetchError("too many redirects")
}
