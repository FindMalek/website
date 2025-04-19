import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    SPOTIFY_CLIENT_ID: z.string().min(1),
    SPOTIFY_CLIENT_SECRET: z.string().min(1),
    SPOTIFY_USER_ID: z.string().min(1),
    SPOTIFY_REDIRECT_URI: z.string().url().optional(),
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
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_USER_ID: process.env.SPOTIFY_USER_ID,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NEXT_PUBLIC_LOGO_DEV_TOKEN: process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
})
