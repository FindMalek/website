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
