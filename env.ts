import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod/v3"

export const env = createEnv({
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    NAVIDROME_URL: z.string().url().optional(),
    NAVIDROME_USER: z.string().min(1).optional(),
    NAVIDROME_PASSWORD: z.string().min(1).optional(),
    GITHUB_TOKEN: z.string().min(1).startsWith("github_pat_"),
    GROQ_API_KEY: z.string().min(1).startsWith("gsk_"),
    RESEND_API_KEY: z.string().min(1).startsWith("re_"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_LOGO_DEV_TOKEN: z.string().min(1).startsWith("pk_"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NAVIDROME_URL: process.env.NAVIDROME_URL,
    NAVIDROME_USER: process.env.NAVIDROME_USER,
    NAVIDROME_PASSWORD: process.env.NAVIDROME_PASSWORD,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NEXT_PUBLIC_LOGO_DEV_TOKEN: process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
})
