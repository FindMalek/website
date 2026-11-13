import type { JourneyCard } from "./types"

const CV = { label: "CV (PDF)", href: "/cv.pdf", kind: "source" } as const

const SITE_REPO = "https://github.com/FindMalek/website"
const SONARAEM_REPO = "https://github.com/FindMalek/sonaraem"

export const JOURNEY_CARDS: JourneyCard[] = [
  {
    id: "r-where",
    question: "Where are you based, and what time zone?",
    answer: [
      "I live in Monastir, Tunisia. That is Africa/Tunis time, UTC+1 all year.",
      "I work remotely with a team in Berlin, so we are never more than an hour apart.",
      "I am open to relocation.",
    ],
    proof: [
      CV,
      {
        label: "Jobflow case study",
        href: "/work/jobflow",
        kind: "case-study",
      },
    ],
  },
  {
    id: "r-mode",
    question: "Remote or relocation?",
    answer: [
      "Remote is how I work today. Since September 2024 I am full-time at Jobflow, a Berlin company, from Monastir.",
      "My other recent roles were remote too: QTech AI in Germany, 8Returns in Berlin, Function03 Labs in San Francisco.",
      "I am open to relocation if the role needs it.",
    ],
    proof: [
      { label: "Jobflow", href: "/work/jobflow", kind: "case-study" },
      { label: "QTech AI", href: "/work/qtech", kind: "case-study" },
      { label: "8Returns", href: "/work/8returns", kind: "case-study" },
    ],
  },
  {
    id: "r-roles",
    question: "What roles are you after?",
    answer: [
      "Senior full-stack engineer, with a focus on AI products, automation and LLM systems. That is the headline on my CV.",
      "The work I do best is shipping LLM features to production: the pipelines, the evals, and the product UI around them.",
      "I have also been a CTO and a co-founder, so owning a whole area is fine with me.",
    ],
    proof: [
      CV,
      { label: "Jobflow", href: "/work/jobflow", kind: "case-study" },
      { label: "QTech AI", href: "/work/qtech", kind: "case-study" },
    ],
  },
  {
    id: "r-seniority",
    question: "How senior are you, and how many years?",
    answer: [
      "5+ years shipping production software, as stated on my CV.",
      "Today I am a Senior Full-Stack Engineer (AI Systems) at Jobflow, full-time since September 2024.",
      "Along the way I was CTO at QTech AI (now Qorelo) in 2025, and co-founder and CTO at Undrstnd Labs from March 2024 to June 2025.",
    ],
    proof: [
      CV,
      { label: "Jobflow", href: "/work/jobflow", kind: "case-study" },
      {
        label: "Undrstnd Labs",
        href: "/work/undrstnd-labs",
        kind: "case-study",
      },
    ],
  },
  {
    id: "r-availability",
    question: "When can you start, and how do I book a call?",
    answer: [
      "I do not publish a start date on the site, because it depends on the role.",
      "The quickest way is to book a call on my calendar, or email me with the role and the timing.",
      "Those two things are what I need to give you a real answer.",
    ],
    proof: [
      {
        label: "Book a call",
        href: "https://cal.com/findmalek",
        kind: "contact",
      },
      {
        label: "hi@findmalek.com",
        href: "mailto:hi@findmalek.com",
        kind: "contact",
      },
    ],
  },
  {
    id: "r-cv",
    question: "Can I get your CV?",
    answer: [
      "Yes. It is a PDF built from my live resume, so it is always the current version.",
      "At the end of this walkthrough you can also copy a short summary with links, for your notes or your ATS.",
      "It lists the same roles and numbers you see in these cards.",
    ],
    proof: [CV],
  },

  {
    id: "h-llm",
    question: "What have you shipped to production with LLMs?",
    answer: [
      "At Jobflow I refactored the interview analyzer and built the task extractor. They read recruiter conversations and turn them into confirmed interviews and structured tasks.",
      "Both were scored by eval datasets and rolled out behind a feature flag.",
      "At QTech AI I built RAG document processing and a support chatbot with a router agent. At 8Returns I built a Shopify-embedded return flow with an AI chatbot.",
    ],
    proof: [
      { label: "Jobflow", href: "/work/jobflow", kind: "case-study" },
      { label: "QTech AI", href: "/work/qtech", kind: "case-study" },
      { label: "8Returns", href: "/work/8returns", kind: "case-study" },
    ],
  },
  {
    id: "h-evals",
    question: "How do you evaluate AI work?",
    answer: [
      "At Jobflow the AI services have fixture datasets and run in Braintrust, with traces so one conversation reads as one tree.",
      "There is an end-to-end chain eval scored by an LLM judge. The task extractor was built eval first: the PR that added the task shape also added its scoring.",
      "Evals also gated a switch to a cheaper model for non-sensitive prompts. The chat on this site has its own eval suite too.",
    ],
    proof: [
      { label: "Jobflow", href: "/work/jobflow", kind: "case-study" },
      {
        label: "This site's chat evals",
        href: `${SITE_REPO}/tree/b167170/evals`,
        kind: "code",
      },
    ],
  },
  {
    id: "h-win",
    question: "What is the biggest win you can show me?",
    answer: [
      "An admin tool estimated how many users sit within a distance of a job location, and it was slow.",
      "I measured it with a benchmark script on a near-production clone, then replaced the per-row distance math with a PostGIS geography column and a partial GIST index.",
      "The estimate went from about 90 seconds to about 100 milliseconds, roughly 900x.",
      "The other one I am proud of: after the rollout I deleted the old v1 to v3 pipelines, about 16,000 lines.",
    ],
    proof: [
      {
        label: "Jobflow case study",
        href: "/work/jobflow",
        kind: "case-study",
      },
      {
        label: "Numbers: Jobflow, by the numbers",
        href: "/work/jobflow",
        kind: "source",
      },
    ],
  },
  {
    id: "h-bug",
    question: "What is the hardest bug you have dealt with?",
    answer: [
      "In Sonaraem, classifying a music library fires a lot of concurrent Groq requests.",
      "The AI SDK's own retry was stacked on top of p-retry, so one rate-limited call could turn into up to 16 requests and hit the token limit even harder.",
      "I fixed it by teaching the retry layer to treat Groq's schema-validation errors as their own split-retryable case, instead of retrying everything.",
    ],
    proof: [
      { label: "Sonaraem", href: "/projects/sonaraem", kind: "case-study" },
      {
        label: "retry.ts",
        href: `${SONARAEM_REPO}/blob/7335f2b/packages/ai-provider/src/retry.ts#L27-L41`,
        kind: "code",
      },
    ],
  },
  {
    id: "h-team",
    question: "How do you work in a team?",
    answer: [
      "At Jobflow: 332 merged PRs and 315 PRs reviewed, top 10 of 47 contributors by commits. I review almost as much as I ship.",
      "At Dukkani there are 4 contributors and 200+ merged PRs. I hired one of them and I review the PRs.",
      "Every Dukkani pull request gets its own database branch and preview stack, so a change can be clicked through before it merges.",
    ],
    proof: [
      { label: "Jobflow", href: "/work/jobflow", kind: "case-study" },
      { label: "Dukkani", href: "/projects/dukkani", kind: "case-study" },
      {
        label: "Post: a database per PR",
        href: "/blog/a-database-per-pull-request",
        kind: "post",
      },
    ],
  },
  {
    id: "h-90",
    question: "What would you do in your first 90 days?",
    answer: [
      "I would start by finding out how the AI work is measured. If there is no eval dataset, I would build a small one before changing anything.",
      "Then I would ship in small steps behind a feature flag, the way the Jobflow pipelines were rolled out.",
      "And clean up once the new path is trusted. At Jobflow that meant deleting about 16,000 lines of old pipeline code.",
    ],
    proof: [{ label: "Jobflow", href: "/work/jobflow", kind: "case-study" }],
  },

  {
    id: "f-alone",
    question: "What can you ship on your own?",
    answer: [
      "Sonaraem is solo-built. It syncs a Spotify library, classifies 4,409 tracks with an LLM, clusters them and builds mood playlists in a Trigger.dev pipeline.",
      "Zero Locker is a self-hosted vault where every item is encrypted with AES-256-GCM. Next.js, Prisma, oRPC and BetterAuth.",
      "This site is mine too: the chatbot, its eval suite and the case studies.",
    ],
    proof: [
      { label: "Sonaraem", href: "/projects/sonaraem", kind: "case-study" },
      {
        label: "Zero Locker",
        href: "/projects/zero-locker",
        kind: "case-study",
      },
      { label: "This site", href: "/projects/findmalek", kind: "case-study" },
    ],
  },
  {
    id: "f-built",
    question: "What have you built and run end to end?",
    answer: [
      "Undrstnd Labs: I co-founded it and was CTO from March 2024 to June 2025. We built an AI inference API compatible with the Vercel AI SDK, and ran 2 events in Tunisia that gave teams free credits.",
      "Endless Byte: I co-founded a software agency and delivered client projects end to end, like Promolab, a trilingual product catalog with an admin dashboard.",
      "Dukkani: multi-tenant storefronts for Instagram and Facebook sellers in Tunisia. 200+ merged PRs, 4 contributors.",
    ],
    proof: [
      {
        label: "Undrstnd Labs",
        href: "/work/undrstnd-labs",
        kind: "case-study",
      },
      { label: "Endless Byte", href: "/work/endless-byte", kind: "case-study" },
      { label: "Dukkani", href: "/projects/dukkani", kind: "case-study" },
    ],
  },
  {
    id: "f-scope",
    question: "How do you scope and decide?",
    answer: [
      "I measure first, then decide. For Sonaraem I measured how fast Spotify's dev-mode allowlist can actually change, and it was not what my design assumed.",
      "So I reversed course: a fixed cap of 4 users plus 1 admin seat, and I deleted the rotation code.",
      "When more friends wanted in, I went back to rotation, this time built around the measured limit: a rolling 24 hour ledger of 4 adds and 4 removes a day.",
    ],
    proof: [
      {
        label: "Post: Five seats, five adds a day",
        href: "/blog/spotify-allowlist-rotation",
        kind: "post",
      },
      { label: "Sonaraem", href: "/projects/sonaraem", kind: "case-study" },
    ],
  },

  {
    id: "e-site",
    question: "How is this site built?",
    answer: [
      "Next.js and TypeScript. Case studies are MDX files checked against a schema, and the resume is pulled live from my RxResume master.",
      "The chat runs on the Vercel AI SDK and Groq, with tool calls for booking a call and sharing my CV, and an eval suite guarding its answers.",
      "Interview mode, the thing you are in now, runs on the same chat and the same knowledge.",
    ],
    proof: [
      { label: "This site", href: "/projects/findmalek", kind: "case-study" },
      {
        label: "Chat route",
        href: `${SITE_REPO}/blob/027a92e/app/api/chat/route.ts#L70-L154`,
        kind: "code",
      },
    ],
  },
  {
    id: "e-stack",
    question: "What is the stack, and why?",
    answer: [
      "TypeScript almost everywhere. Next.js and React on the front, Postgres behind it, with Prisma, Drizzle or PostGIS depending on the job.",
      "For LLM work I use the Vercel AI SDK, with Braintrust for evals and tracing.",
      "My region post is the why behind how I debug: Zero Locker felt slow because the functions ran in Virginia and the database in Frankfurt. I check where things run before blaming the code.",
    ],
    proof: [
      { label: "Stack on the homepage", href: "/#stack", kind: "source" },
      {
        label: "Post: Virginia vs Frankfurt",
        href: "/blog/why-your-region-matters",
        kind: "post",
      },
    ],
  },
  {
    id: "e-oss",
    question: "Which open source work should I look at?",
    answer: [
      "Databuddy: 5 merged PRs. The repo went closed source, so my commits live in my public fork. One of them batches goal analytics queries into ClickHouse (+594 / -103), written up in a blog post.",
      "Function03 Labs: 122 commits to UniswapHooks, 87 of about 100 to TallyZero, 85 to WalletLabels.",
      "I am #1 in Tunisia on Gitista, with 7,000+ lifetime GitHub contributions, 3,057 of them in the last 12 months.",
    ],
    proof: [
      {
        label: "Post: batching ClickHouse in Databuddy",
        href: "/blog/batching-clickhouse-queries-in-databuddy",
        kind: "post",
      },
      {
        label: "Function03 Labs",
        href: "/work/function03",
        kind: "case-study",
      },
      {
        label: "Gitista profile",
        href: "https://gitista.com/search/?country=TN&handle=FindMalek",
        kind: "source",
      },
    ],
  },
  {
    id: "e-writing",
    question: "Do you write about your work?",
    answer: [
      "Yes, a few posts, all from things I built.",
      "How Dukkani gives every pull request its own database, how I batched 40 ClickHouse queries into one in Databuddy, and what my in-memory rate limiter gets wrong.",
      "There are also posts on Spotify's allowlist limits and on keeping the app and the database in the same region.",
    ],
    proof: [
      {
        label: "A database per PR",
        href: "/blog/a-database-per-pull-request",
        kind: "post",
      },
      {
        label: "Batching ClickHouse",
        href: "/blog/batching-clickhouse-queries-in-databuddy",
        kind: "post",
      },
      {
        label: "Rate limiting oRPC",
        href: "/blog/rate-limiting-orpc",
        kind: "post",
      },
    ],
  },

  {
    id: "x-who",
    question: "Who are you?",
    answer: [
      "I am Malek, a senior full-stack engineer from Monastir, Tunisia, working remotely.",
      "These days I build AI pipelines at Jobflow, a Berlin recruiting platform, with evals and tracing around them.",
      "I have also co-founded Undrstnd Labs and Endless Byte, and I built Dukkani and Sonaraem.",
    ],
    proof: [
      { label: "Jobflow", href: "/work/jobflow", kind: "case-study" },
      CV,
    ],
  },
]

export const JOURNEY_CARD_BY_ID = new Map(
  JOURNEY_CARDS.map((card) => [card.id, card])
)
