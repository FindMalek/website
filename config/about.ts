export type AboutSegment = string | { text: string; href?: string }

// Rendered by components/app/about-overview.tsx and sent to the chatbot as plain text.
export const ABOUT_BIO: AboutSegment[][] = [
  [
    "Hi, I'm Malek Gara-Hellal. I'm a Design Engineer, Founder, and Product Builder focused on turning ideas into real, scalable systems.",
  ],
  [
    "I founded ",
    { text: "Undrstnd Labs", href: "https://undrstnd.dev" },
    ", an AI development and research lab focused on solving real-world problems through thoughtfully designed products. Our work spans education with ",
    { text: "Undrstnd Education" },
    " and ",
    { text: "Undrstnd Developers" },
    ", and we continue to ship new applications in production.",
  ],
  [
    "Before that, I founded ",
    {
      text: "Endless Byte",
      href: "https://www.linkedin.com/company/endless-byte/posts/?feedView=all",
    },
    ", a web development startup in Tunisia where I worked closely with founders and businesses to ship production-grade web applications, mainly in e-commerce and internal tools.",
  ],
  [
    "I also co-founded ",
    { text: "Artweave", href: "https://www.instagram.com/artweave.originals/" },
    ", a clothing brand that explored creative direction, branding, and product execution, and was later acquired by Tunisian Design in 2023.",
  ],
  [
    "More recently, I've been building ",
    { text: "Dukkani", href: "/projects/dukkani" },
    ", a product focused on simplifying digital operations for local businesses by combining design, automation, and practical tooling.",
  ],
  [
    "My philosophy is simple: I don't build features, I build systems. I focus on creating structures that scale — in code, in products, and in how teams work. I care deeply about maintainability, clarity, and long-term leverage over short-term hacks.",
  ],
  [
    "My journey hasn't been linear. I started by taking on small freelance work, building and shipping constantly, failing fast, and iterating in public and private. Over time, that evolved into founding products, working with teams, contributing to open-source, and designing systems that survive real usage.",
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
// and photo stories; the Qorelo raise is public (tech.eu, 15 June 2026).
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
      "My QTech AI co-founders went on to start Qorelo and raised a $3.5M seed in June 2026.",
  },
]
