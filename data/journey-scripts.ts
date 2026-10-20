export type JourneyScript = {
  id: string
  title: string
  summary: string
  details: string
}

export const INTRODUCTION_SCRIPT: { steps: JourneyScript[] } = {
  steps: [
    {
      id: "hello",
      title: "Hello",
      summary:
        "Hello, I'm Malek — a senior full-stack engineer who builds AI-native products end to end. Let me walk you through what I've shipped, in about two minutes.",
      details:
        "I'm based in Monastir, Tunisia, and work remotely with teams in Berlin and the US. Eight chapters ahead — press space to fast-forward at any time.",
    },
    {
      id: "jobflow",
      title: "Jobflow GmbH",
      summary:
        "I'm currently at Jobflow in Berlin, building AI pipelines for recruiter-candidate workflows.",
      details:
        "At Jobflow I refactored the interview analyzer, built a task extractor from recruiter conversations, and cut an admin search from ninety seconds to a hundred milliseconds using PostGIS. I also set up Braintrust evals and tracing, and extended CV/cover-letter smoke tests across every template.",
    },
    {
      id: "8returns",
      title: "8Returns",
      summary:
        "At 8Returns I built a Shopify-embedded AI returns chatbot for refunds, exchanges, and store credit.",
      details:
        "I built the streaming chat UI on TanStack Query against a Rails backend, brought reply times down from around ten seconds to three, and worked closely with the backend team on data contracts.",
    },
    {
      id: "qorelo",
      title: "Qorelo",
      summary:
        "As CTO of Qorelo, I built RAG document-processing systems and a router-agent support chatbot for enterprise clients.",
      details:
        "I designed a multi-agent pipeline that parses uploaded PDFs, picks the right knowledge source per question, and improves its own context over time. I also built the company's marketing site.",
    },
    {
      id: "undrstnd",
      title: "Undrstnd Labs",
      summary:
        "I co-founded Undrstnd Labs in Rome and shipped an AI inference API compatible with the Vercel AI SDK.",
      details:
        "We applied to Y Combinator, got rejected, and launched anyway. I built the inference API and a developer platform around it, and ran two events in Tunisia giving teams free platform credits.",
    },
    {
      id: "function03",
      title: "Function03 Labs",
      summary:
        "At Function03 I worked on open-source Web3 tooling: WalletLabels, TallyZero, and UniswapHooks.",
      details:
        "I contributed the majority of commits to TallyZero, refactored WalletLabels to Next.js 14, and restructured the UniswapHooks app and marketing site.",
    },
    {
      id: "endless-byte",
      title: "Endless Byte",
      summary:
        "I founded Endless Byte, a small agency that delivered client projects end to end.",
      details:
        "We built Promolab, a trilingual product catalog with an admin dashboard and quote mailer, and a membership CRM for gym chains with WhatsApp-based messaging.",
    },
    {
      id: "digital-army",
      title: "Digital Army",
      summary:
        "My first real industry work was at Digital Army, where I built a portfolio site and a Shopify product pipeline.",
      details:
        "I built a custom Shopify template and an AI-assisted pipeline that uploaded over a thousand products with generated images and descriptions.",
    },
    {
      id: "projects",
      title: "Side projects",
      summary:
        "Outside of work I ship products like Sonaraem, Dukkani, Zero Locker, guesswork, and keep-player.",
      details:
        "Sonaraem is an LLM-powered music intelligence system. Dukkani is multi-tenant commerce for social sellers in Tunisia. Zero Locker is a self-hosted secrets vault. guesswork ranks zsh autosuggestions with an AI model. keep-player is a web client for self-hosted Navidrome.",
    },
  ],
}
