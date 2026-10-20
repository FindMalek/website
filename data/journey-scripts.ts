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
  architecture: string[]
  caseStudyHref?: string
  prompts: string[]
}

export const INTRODUCTION_SCRIPT: { steps: JourneyScript[] } = {
  steps: [
    {
      id: "hello",
      title: "Malek Gara-Hellal",
      role: "Design Engineer · AI Systems · Product Builder",
      period: "2020 — Present",
      location: "Monastir, TN · Berlin, DE",
      logo: "/about/author.png",
      accent: "rgba(0, 112, 243, 0.22)",
      summary:
        "I'm Malek — a full-stack and design engineer who ships AI-native products from zero to production. Here's the two-minute director's cut of what I've built.",
      details:
        "I work from Monastir, Tunisia with engineering teams in Berlin and the US. Every chapter ahead is backed by real production telemetry, shipped pull requests, and open-source code you can inspect.",
      metrics: [
        {
          value: "332+",
          label: "Merged PRs at Jobflow",
          detail: "Plus 315 pull requests reviewed across the monorepo",
        },
        {
          value: "900×",
          label: "PostGIS Search Speedup",
          detail: "Cut admin radius queries from ~90s to ~100ms (#5594)",
        },
        {
          value: "15+",
          label: "Products Shipped",
          detail: "Across AI pipelines, developer tooling, and commerce",
        },
      ],
      architecture: [
        "TypeScript",
        "Next.js 16",
        "AI SDK / Braintrust",
        "PostGIS",
        "Turborepo",
      ],
      prompts: [
        "What kind of engineering roles are you looking for next?",
        "What's your favorite system you've architected recently?",
      ],
    },
    {
      id: "jobflow",
      title: "Jobflow GmbH",
      role: "Full-Stack & Applied AI Engineer",
      period: "2024 — Present",
      location: "Berlin, Germany · Remote",
      logo: "/work/jobflow.svg",
      accent: "rgba(16, 185, 129, 0.20)",
      summary:
        "At Jobflow in Berlin, I build eval-gated AI pipelines for recruiter workflows and fix high-leverage database bottlenecks.",
      details:
        "I architected the interview analyzer and conversation task extractor behind feature flags, gated by Braintrust eval datasets and nested LLM-judge traces, then deleted ~16,000 lines of legacy v1–v3 pipeline code. On the data layer, I replaced per-row Haversine SQL with a PostGIS geography column and partial GIST index — dropping user-reach queries from ~90 seconds to ~100 milliseconds.",
      metrics: [
        {
          value: "90s → 100ms",
          label: "PostGIS + Partial GIST",
          detail: "PR #5594 — ~900× faster geospatial radius estimation",
        },
        {
          value: "332 / 315",
          label: "PRs Merged / Reviewed",
          detail: "Top-10 contributor out of 47 engineers in the monorepo",
        },
        {
          value: "-16,000 LOC",
          label: "Legacy Pipelines Retired",
          detail: "Shipped v2/v3 AI chains with 48 Braintrust eval commits",
        },
      ],
      architecture: [
        "Recruiter Thread",
        "Task & Interview Extractor",
        "Braintrust LLM Judge",
        "PostGIS GIST Index",
      ],
      caseStudyHref: "/work/jobflow",
      prompts: [
        "How did you cut the Jobflow search query from 90s to 100ms?",
        "How do your Braintrust evals gate AI changes at Jobflow?",
      ],
    },
    {
      id: "8returns",
      title: "8Returns",
      role: "Frontend & AI Product Engineer",
      period: "2024",
      location: "Berlin, Germany · Remote",
      logo: "/work/8returns.webp",
      accent: "rgba(6, 182, 212, 0.20)",
      summary:
        "At 8Returns, I built the Shopify-embedded AI returns assistant that handles refunds, exchanges, and store credit in real time.",
      details:
        "I engineered the streaming chat experience on TanStack Query against a Ruby on Rails backend, co-designed the API contracts with the core team, and streamlined token delivery and state reconciliation so shoppers could resolve returns inside the merchant storefront.",
      metrics: [
        {
          value: "Shopify",
          label: "Embedded Storefront UI",
          detail: "Zero-redirect self-service returns, exchanges & credit",
        },
        {
          value: "Streaming",
          label: "TanStack Query + Rails",
          detail: "Optimistic state updates with typed API contracts",
        },
        {
          value: "3 Flows",
          label: "Refund · Exchange · Credit",
          detail: "Automated resolution paths before human escalation",
        },
      ],
      architecture: [
        "Shopify Storefront",
        "Streaming Chat UI",
        "TanStack Query Cache",
        "Rails Returns Engine",
      ],
      caseStudyHref: "/work/8returns",
      prompts: [
        "What was the hardest part of embedding the 8Returns AI chat in Shopify?",
        "How did you structure TanStack Query with the Rails backend?",
      ],
    },
    {
      id: "qorelo",
      title: "Qorelo",
      role: "Chief Technology Officer",
      period: "2024 — 2025",
      location: "Germany · Remote",
      logo: "/work/qtech.svg",
      accent: "rgba(139, 92, 246, 0.22)",
      summary:
        "As CTO of Qorelo, I architected multi-agent RAG document pipelines and router-agent support systems for enterprise clients.",
      details:
        "I designed a multi-agent ingestion and routing pipeline that parses complex PDFs, dynamically selects the right knowledge source per query, and continuously refines its retrieval context over time — alongside shipping the company's web presence and client delivery infrastructure.",
      metrics: [
        {
          value: "Multi-Agent",
          label: "Router + RAG Pipeline",
          detail: "Dynamic source selection across enterprise PDF corpora",
        },
        {
          value: "CTO",
          label: "End-to-End Architecture",
          detail: "Owned system design, client delivery, and web platform",
        },
        {
          value: "Adaptive",
          label: "Self-Improving Context",
          detail: "Feedback loop that sharpens retrieval quality over time",
        },
      ],
      architecture: [
        "PDF Corpus Ingestion",
        "Semantic Chunking",
        "Router Agent",
        "Verified Answer Synthesis",
      ],
      caseStudyHref: "/work/qtech",
      prompts: [
        "How does the router agent decide which knowledge source to query at Qorelo?",
        "What did you learn serving as CTO at Qorelo?",
      ],
    },
    {
      id: "undrstnd",
      title: "Undrstnd Labs",
      role: "Co-Founder & CTO",
      period: "2024",
      location: "Rome, Italy & Tunisia",
      logo: "/work/undrstnd-labs.png",
      accent: "rgba(245, 158, 11, 0.20)",
      summary:
        "I co-founded Undrstnd Labs in Rome, shipped a Vercel AI SDK-compatible inference platform, and built an AI study workspace.",
      details:
        "We applied to Y Combinator, got rejected, and shipped anyway. I built Undrstnd Education — a RAG study workspace pairing OpenAI embeddings in Pinecone with low-latency Groq chat over side-by-side PDFs — plus developer API tooling and two builder hackathons in Tunisia.",
      metrics: [
        {
          value: "AI SDK",
          label: "Drop-in Provider API",
          detail: "Unified inference & developer console for builders",
        },
        {
          value: "RAG + PDF",
          label: "Undrstnd Education",
          detail: "Pinecone vector search + Groq streaming over textbooks",
        },
        {
          value: "2 Events",
          label: "Tunisia Hackathons",
          detail: "Sponsored student teams with free platform credits",
        },
      ],
      architecture: [
        "PDF Upload & OCR",
        "OpenAI Embeddings",
        "Pinecone Vector DB",
        "Groq Low-Latency Stream",
      ],
      caseStudyHref: "/work/undrstnd-labs",
      prompts: [
        "Tell me the story of co-founding Undrstnd Labs in Rome.",
        "How does Undrstnd Education combine OpenAI embeddings with Groq?",
      ],
    },
    {
      id: "function03",
      title: "Function03 Labs",
      role: "Full-Stack Open-Source Engineer",
      period: "2024",
      location: "Remote",
      logo: "/work/function03-labs.svg",
      accent: "rgba(99, 102, 241, 0.22)",
      summary:
        "At Function03 Labs, I shipped open-source Web3 infrastructure across TallyZero, WalletLabels, and UniswapHooks.",
      details:
        "I authored the majority of commits for TallyZero (a zero-dependency decentralized voting client), migrated WalletLabels to Next.js 14 with fast Ethereum address search, and restructured the Uniswap v4 Hooks directory and marketing site.",
      metrics: [
        {
          value: "TallyZero",
          label: "Lead Contributor",
          detail: "Zero-dependency on-chain governance voting client",
        },
        {
          value: "WalletLabels",
          label: "Next.js 14 Migration",
          detail: "Ethereum address & entity label search engine",
        },
        {
          value: "Uniswap v4",
          label: "Hooks Directory",
          detail: "Restructured open-source registry and web app",
        },
      ],
      architecture: [
        "TallyZero Governance",
        "WalletLabels Search",
        "UniswapHooks Registry",
        "100% Open Source",
      ],
      caseStudyHref: "/work/function03",
      prompts: [
        "What did you build on TallyZero and WalletLabels at Function03?",
        "How do you approach open-source architecture?",
      ],
    },
    {
      id: "endless-byte",
      title: "Endless Byte",
      role: "Founder & Lead Engineer",
      period: "2023 — 2024",
      location: "Tunisia",
      logo: "/work/endless-byte.jpg",
      accent: "rgba(244, 63, 94, 0.20)",
      summary:
        "I founded Endless Byte, a product studio delivering full-stack commerce, catalogs, and CRM systems end to end.",
      details:
        "We shipped Promolab — a trilingual (FR/EN/AR) industrial product catalog with an admin dashboard and automated quote mailer — alongside a multi-branch gym membership CRM featuring automated WhatsApp notifications.",
      metrics: [
        {
          value: "3 Locales",
          label: "Promolab Catalog",
          detail: "Trilingual catalog + admin dashboard & quote engine",
        },
        {
          value: "WhatsApp",
          label: "Automated Gym CRM",
          detail: "Multi-branch membership tracking & renewal alerts",
        },
        {
          value: "0 → 1",
          label: "Founder Delivery",
          detail: "Scoped, designed, and deployed every client system",
        },
      ],
      architecture: [
        "Client Discovery",
        "Trilingual Next.js App",
        "Admin & Quote Engine",
        "WhatsApp Automation",
      ],
      caseStudyHref: "/work/endless-byte",
      prompts: [
        "What did building client products at Endless Byte teach you?",
        "How did you architect the Promolab trilingual catalog?",
      ],
    },
    {
      id: "digital-army",
      title: "Digital Army",
      role: "Full-Stack Developer",
      period: "2023",
      location: "Tunisia",
      logo: "/work/digital-army.svg",
      accent: "rgba(14, 165, 233, 0.20)",
      summary:
        "My first industry role was at Digital Army, where I built custom storefronts and an AI-assisted pipeline for 1,000+ products.",
      details:
        "Instead of manually uploading catalog inventory, I wrote an automated pipeline that generated product descriptions, processed imagery, and synced over a thousand SKUs directly into a custom Shopify theme.",
      metrics: [
        {
          value: "1,000+",
          label: "Automated SKUs",
          detail: "AI-assisted copy & image pipeline into Shopify",
        },
        {
          value: "Custom",
          label: "Shopify Theme & Web",
          detail: "Tailored storefront and agency portfolio",
        },
        {
          value: "First Role",
          label: "Where It Started",
          detail: "Turned manual catalog grunt work into software",
        },
      ],
      architecture: [
        "Raw Supplier Catalog",
        "AI Copy & Image Pipeline",
        "Shopify Admin API",
        "Custom Storefront",
      ],
      caseStudyHref: "/work/digital-army",
      prompts: [
        "How did your 1,000-product Shopify automation pipeline work?",
      ],
    },
    {
      id: "projects",
      title: "The Lab — Open Source & Products",
      role: "Independent Builder",
      period: "Continuous",
      location: "github.com/FindMalek",
      logo: "/about/author.png",
      accent: "rgba(59, 130, 246, 0.24)",
      summary:
        "After hours, I build tools I wish existed: Sonaraem, keep-player, Dukkani, Zero Locker, and guesswork.",
      details:
        "Sonaraem runs a 6-stage LLM pipeline to classify and cluster my 4,409-track music library. keep-player renders 10,000 Navidrome songs in 102ms with typo-tolerant search. Dukkani gives social sellers multi-tenant storefronts. Zero Locker encrypts secrets client-side. guesswork ranks zsh history with AI.",
      metrics: [
        {
          value: "102 ms",
          label: "keep-player 10k Songs",
          detail: "Virtualized Navidrome web player with 159 kB gzip JS",
        },
        {
          value: "4,409",
          label: "Tracks in Sonaraem",
          detail: "Multi-stage LLM audio classification & clustering",
        },
        {
          value: "E2EE",
          label: "Zero Locker & Dukkani",
          detail: "Client-encrypted vault + multi-tenant social commerce",
        },
      ],
      architecture: [
        "Sonaraem (LLM Music)",
        "keep-player (Navidrome)",
        "Dukkani (Multi-Tenant)",
        "Zero Locker & guesswork",
      ],
      caseStudyHref: "/projects/keep-player",
      prompts: [
        "How does Sonaraem cluster 4,409 songs with LLMs?",
        "How did you get keep-player to render 10,000 songs in 102ms?",
      ],
    },
  ],
}
