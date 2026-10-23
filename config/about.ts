export type AboutSegment = string | { text: string; href?: string }

// Rendered by components/app/about-overview.tsx and sent to the chatbot as plain text.
export const ABOUT_BIO: AboutSegment[][] = [
  [
    "Hi, I'm Malek Gara-Hellal, a senior full-stack engineer from Monastir, Tunisia. I build AI products and the systems around them: pipelines, evals, search, and the interfaces people use.",
  ],
  [
    "Right now I work full-time at ",
    { text: "Jobflow", href: "/work/jobflow" },
    ", where I build the AI pipelines that turn recruiter conversations into interview confirmations and tasks, and the eval and tracing setup that keeps them honest.",
  ],
  [
    "I co-founded ",
    { text: "Undrstnd Labs", href: "/work/undrstnd-labs" },
    ", an AI lab where we built an inference API compatible with the Vercel AI SDK and a developer platform around it. Before that I co-founded ",
    {
      text: "Endless Byte",
      href: "https://www.linkedin.com/company/endless-byte/posts/?feedView=all",
    },
    ", a web agency in Tunisia that shipped e-commerce and internal tools for local businesses.",
  ],
  [
    "I also co-founded ",
    { text: "Artweave", href: "https://www.instagram.com/artweave.originals/" },
    ", a clothing brand that was acquired by Tunisian Design in 2023.",
  ],
  [
    "More recently I've been building ",
    { text: "Dukkani", href: "/projects/dukkani" },
    ", which gives Instagram and Facebook sellers in Tunisia a storefront, and ",
    { text: "Sonaraem", href: "/projects/sonaraem" },
    ", which classifies and clusters a Spotify library with an LLM.",
  ],
  [
    "I like systems that stay maintainable: typed boundaries, evals for anything that involves a model, and previews that clean up after themselves. I write about the details on the blog.",
  ],
  [
    "My path wasn't linear. I started with small freelance work and kept building and shipping, which grew into founding products, working with teams in Berlin and the US, and contributing to open source.",
  ],
]

export function aboutSegmentsToText(paragraph: AboutSegment[]): string {
  return paragraph
    .map((segment) => (typeof segment === "string" ? segment : segment.text))
    .join("")
}

export type AboutStamp = {
  id: string
  headline: string
  ink: string
  country: string
  value: string
  caption: string
  story: string
}

// Rendered by components/app/about-overview-stamps.tsx. Each stamp is a real
// moment, so keep every claim sourced: Artweave and the hair are in the bio
// and photo stories; the Qorelo (formerly QTech AI) raise is public (tech.eu, 15 June 2026).
export const ABOUT_STAMPS: AboutStamp[] = [
  {
    id: "hair",
    headline: "RIP",
    ink: "#0f2b46",
    country: "Tunisie",
    value: "2020–25",
    caption: "The hair",
    story:
      "Grew it out from January 2020, cut it in March 2025. Rest in peace.",
  },
  {
    id: "artweave",
    headline: "SOLD",
    ink: "#b0432a",
    country: "Tunisie",
    value: "2023",
    caption: "Artweave",
    story:
      "Co-founded Artweave, a clothing brand. Acquired by Tunisian Design in 2023.",
  },
  {
    id: "qorelo",
    headline: "$3.5M",
    ink: "#1f5b4a",
    country: "Deutschland",
    value: "2026",
    caption: "Qorelo seed",
    story:
      "QTech AI, where I was CTO, is now Qorelo, and it raised a $3.5M seed in June 2026.",
  },
]
