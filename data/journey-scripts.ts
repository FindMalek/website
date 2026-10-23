export type JourneyMetric = {
  value: string
  label: string
  detail: string
}

export type JourneyScript = {
  id: string
  title: string
  role: string
  period: string
  location: string
  logo: string
  accent: string
  summary: string
  details: string
  metrics: JourneyMetric[]
  stack: string[]
  caseStudyHref?: string
  prompts: string[]
}

export const INTRODUCTION_SCRIPT: { steps: JourneyScript[] } = {
  steps: [
    {
      id: "hello",
      title: "Malek Gara-Hellal",
      role: "Senior Full-Stack Engineer, AI Systems",
      period: "2021 to present",
      location: "Monastir, Tunisia · Remote",
      logo: "/about/author.png",
      accent: "rgba(0, 112, 243, 0.22)",
      summary:
        "I'm Malek, a full-stack engineer based in Monastir, Tunisia. I build AI products and the tooling around them. This is a short walk through where I've worked, newest first.",
      details:
        "I work remotely with teams in Germany. Each chapter links to the full case study, and you can ask the chat about anything you read here.",
      metrics: [
        {
          value: "332",
          label: "Merged PRs at Jobflow",
          detail: "315 more reviewed, from the git history",
        },
        {
          value: "15",
          label: "Projects",
          detail: "Listed in the projects section of this site",
        },
      ],
      stack: ["TypeScript", "Next.js", "LLM pipelines", "PostgreSQL"],
      prompts: [
        "What kind of engineering roles are you looking for next?",
        "What's the system you're proudest of?",
      ],
    },
    {
      id: "jobflow",
      title: "Jobflow GmbH",
      role: "Senior Full-Stack Engineer (AI Systems)",
      period: "Sep 2024 to present",
      location: "Berlin, Germany · Remote",
      logo: "/work/jobflow.svg",
      accent: "rgba(16, 185, 129, 0.20)",
      summary:
        "At Jobflow I work on the AI pipelines that read recruiter conversations and turn them into interviews and tasks.",
      details:
        "I refactored the interview analyzer, built the task extractor eval first, and set up Braintrust evals and tracing. Both pipelines were rolled out behind a feature flag, and afterwards I deleted about 16,000 lines of the old v1 to v3 code. I also replaced a slow per-row distance query with a PostGIS geography column and a partial GIST index.",
      metrics: [
        {
          value: "332 / 315",
          label: "PRs merged / reviewed",
          detail: "Top 10 of 47 contributors by commit count",
        },
        {
          value: "90 s to 100 ms",
          label: "Admin radius estimate",
          detail: "Measured on a near-production clone with a benchmark script",
        },
        {
          value: "~16,000",
          label: "Lines of old pipeline code deleted",
          detail: "After the v1 to v3 pipelines were retired",
        },
      ],
      stack: ["TypeScript", "Next.js", "Braintrust", "PostGIS", "Turborepo"],
      caseStudyHref: "/work/jobflow",
      prompts: [
        "How did you cut the Jobflow search query from 90s to 100ms?",
        "How do Braintrust evals gate AI changes at Jobflow?",
      ],
    },
    {
      id: "8returns",
      title: "8Returns",
      role: "Senior Frontend Engineer (AI Systems & Shopify)",
      period: "Dec 2025 to Apr 2026",
      location: "Berlin, Germany · Remote",
      logo: "/work/8returns.webp",
      accent: "rgba(6, 182, 212, 0.20)",
      summary:
        "At 8Returns I led the move from a fixed decision-tree returns flow to an LLM-based one.",
      details:
        "The new version uses three pipelines: a structured model that decides between refund, exchange, store credit or re-shipment, a summary model for merchants, and a risk matching model. I built the prompt evals and regression datasets, and the merchant UI inside Shopify, working next to a Ruby on Rails backend team.",
      metrics: [
        {
          value: "3",
          label: "LLM pipelines",
          detail: "Decision, summary and risk matching",
        },
        {
          value: "V3 to V4",
          label: "Returns flow",
          detail: "From decision trees to structured model outputs",
        },
      ],
      stack: ["Vercel AI SDK", "Shopify", "Neon", "Ruby on Rails"],
      caseStudyHref: "/work/8returns",
      prompts: [
        "How did you test the 8Returns decision model?",
        "What changed between V3 and V4 of the returns flow?",
      ],
    },
    {
      id: "deepmetis",
      title: "DeepMetis",
      role: "Technical Advisor",
      period: "Jun 2025 to Aug 2025",
      location: "Berlin, Germany · Remote",
      logo: "/work/deepmetis.svg",
      accent: "rgba(234, 88, 12, 0.18)",
      summary:
        "At DeepMetis I advised part-time, after a take-home assessment that I finished in four hours.",
      details:
        "The assessment was a full-stack Pokemon Battle Arena app with Next.js, Prisma and a type-safe oRPC API. Their production stack was Go on the backend and Svelte on the frontend, which was new to me.",
      metrics: [
        {
          value: "4 h",
          label: "Take-home assessment",
          detail: "Pokemon Battle Arena, full stack",
        },
        {
          value: "Go + Svelte",
          label: "Production stack",
          detail: "Both new to me at the time",
        },
      ],
      stack: ["Go", "Svelte", "TypeScript", "Prisma", "PostgreSQL"],
      caseStudyHref: "/work/deepmetis",
      prompts: ["What did you learn from working in Go and Svelte?"],
    },
    {
      id: "qorelo",
      title: "Qorelo (QTech AI)",
      role: "Chief Technology Officer",
      period: "Apr 2025 to Jul 2025",
      location: "Germany · Remote",
      logo: "/work/qtech.svg",
      accent: "rgba(139, 92, 246, 0.22)",
      summary:
        "I was CTO at QTech AI, now Qorelo, where I built the marketing site and RAG systems for enterprise clients.",
      details:
        "After the website I built RAG systems that index large sets of PDFs for two enterprise clients, plus a support chatbot with a router agent that picks which knowledge source to query. I stepped back in July 2025 to focus on my full-time job.",
      metrics: [
        {
          value: "2",
          label: "Enterprise RAG clients",
          detail: "PDF indexing and custom agents",
        },
        { value: "CTO", label: "Role", detail: "April to July 2025" },
      ],
      stack: ["Next.js", "TypeScript", "RAG", "Vercel"],
      caseStudyHref: "/work/qtech",
      prompts: [
        "How does the router agent pick a knowledge source?",
        "Why did you step back from Qorelo?",
      ],
    },
    {
      id: "undrstnd",
      title: "Undrstnd Labs",
      role: "Founder & CTO",
      period: "Mar 2024 to Jun 2025",
      location: "Rome, Italy · Remote",
      logo: "/work/undrstnd-labs.png",
      accent: "rgba(245, 158, 11, 0.20)",
      summary:
        "I co-founded Undrstnd Labs. We applied to Y Combinator, got rejected, and launched on our own from Rome.",
      details:
        "The product was an inference API that was cheaper than OpenAI, with larger models and Vercel AI SDK compatibility so teams could switch with little work. We also ran two events in Tunisia and gave the teams free platform credits.",
      metrics: [
        {
          value: "AI SDK",
          label: "Compatible API",
          detail: "Drop-in for Vercel AI SDK users",
        },
        {
          value: "2",
          label: "Events in Tunisia",
          detail: "Free platform credits for teams",
        },
      ],
      stack: ["Vercel AI SDK", "Inference API"],
      caseStudyHref: "/work/undrstnd-labs",
      prompts: ["Tell me the story of co-founding Undrstnd Labs."],
    },
    {
      id: "hortensia",
      title: "Hortensia Agency",
      role: "Full Stack Developer",
      period: "May 2024 to Sep 2024",
      location: "Tunisia · Remote",
      logo: "/work/hortensia.svg",
      accent: "rgba(236, 72, 153, 0.18)",
      summary: "At Hortensia Agency I built client web apps full time.",
      details:
        "I built Stelify, a landing page with an admin dashboard for analytics and song statistics, and Primevera, an e-learning platform where instructors post courses and take payments through Stripe. Both were deployed with Docker and Coolify.",
      metrics: [
        {
          value: "2",
          label: "Client products",
          detail: "Stelify and Primevera",
        },
      ],
      stack: ["React", "Next.js", "Stripe", "Docker", "Coolify"],
      caseStudyHref: "/work/hortensia",
      prompts: ["How did you set up payments on Primevera?"],
    },
    {
      id: "function03",
      title: "Function03 Labs",
      role: "UX Engineer & Blockchain Developer",
      period: "Jun 2023 to Aug 2024",
      location: "Remote",
      logo: "/work/function03-labs.svg",
      accent: "rgba(99, 102, 241, 0.22)",
      summary:
        "At Function03 Labs I started as a UX engineer and later also worked as a blockchain developer on open-source Web3 products.",
      details:
        "On WalletLabels I built an admin dashboard, automatic API key generation and a blacklist endpoint. I refactored TallyZero's UI and UX and added a proposals table for voting, and I worked on the rebrand of the UniswapHooks marketing pages.",
      metrics: [
        {
          value: "3",
          label: "Products",
          detail: "WalletLabels, TallyZero, UniswapHooks",
        },
      ],
      stack: ["Next.js", "TypeScript", "MongoDB", "Ethers"],
      caseStudyHref: "/work/function03",
      prompts: ["What did you build on WalletLabels and TallyZero?"],
    },
    {
      id: "endless-byte",
      title: "Endless Byte",
      role: "Co-founder",
      period: "May 2023 to Mar 2024",
      location: "Monastir, Tunisia",
      logo: "/work/endless-byte.jpg",
      accent: "rgba(244, 63, 94, 0.20)",
      summary:
        "I co-founded Endless Byte with two university classmates, a small agency for client projects while we studied.",
      details:
        "We built an e-commerce site for Promolab with Supabase, Prisma and an admin dashboard for managing products, and a membership CRM for gym chains that sends promotions over WhatsApp.",
      metrics: [
        {
          value: "2",
          label: "Client projects",
          detail: "Promolab and a gym chain CRM",
        },
      ],
      stack: ["Next.js", "Supabase", "Prisma"],
      caseStudyHref: "/work/endless-byte",
      prompts: ["What did running an agency while studying teach you?"],
    },
    {
      id: "digital-army",
      title: "Digital Army",
      role: "Web Developer",
      period: "Feb 2021 to May 2023",
      location: "Tunisia · Remote",
      logo: "/work/digital-army.svg",
      accent: "rgba(14, 165, 233, 0.20)",
      summary:
        "At Digital Army I built websites and a Shopify store for clients.",
      details:
        "I built a portfolio site for a digital marketer, and a custom Shopify theme for LilyPharma. For LilyPharma I loaded 1,000+ products with AI-generated descriptions and images, and automated product and inventory updates.",
      metrics: [
        {
          value: "1,000+",
          label: "Products",
          detail: "AI-assisted catalog for LilyPharma",
        },
      ],
      stack: ["Next.js", "Tailwind CSS", "Shopify"],
      caseStudyHref: "/work/digital-army",
      prompts: ["How did the Shopify catalog automation work?"],
    },
    {
      id: "projects",
      title: "Projects",
      role: "Independent builder",
      period: "Ongoing",
      location: "github.com/FindMalek",
      logo: "/about/author.png",
      accent: "rgba(59, 130, 246, 0.24)",
      summary:
        "Outside client work I build my own tools and products, like Sonaraem, keep-player, Dukkani, Zero Locker and guesswork.",
      details:
        "Sonaraem syncs a Spotify library and classifies tracks with an LLM to build playlists. keep-player is a web player for Navidrome, virtualized so a 10,000 song library stays fast. Dukkani is a commerce platform for Tunisian merchants. Zero Locker is a self-hosted password manager that encrypts secrets with AES-256-GCM. guesswork is a zsh plugin that ranks history suggestions with an AI model.",
      metrics: [
        {
          value: "102 ms",
          label: "keep-player",
          detail: "Median time to first row on a 10,000 song demo library",
        },
        {
          value: "AES-256-GCM",
          label: "Zero Locker",
          detail: "Encryption for credentials, cards and secrets",
        },
      ],
      stack: ["Sonaraem", "keep-player", "Dukkani", "Zero Locker", "guesswork"],
      caseStudyHref: "/projects/keep-player",
      prompts: [
        "How does Sonaraem classify tracks with an LLM?",
        "How did you get keep-player fast with 10,000 songs?",
      ],
    },
  ],
}
