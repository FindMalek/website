import { plugin as shadcn } from "@shadcn/lint"
import tsParser from "@typescript-eslint/parser"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

// shadcn/lint enforces the design-system contract on Tailwind classes.
// Existing code predates it, so rules start at "warn" repo-wide and are
// "error" inside the dither system, which is written to the contract.
const shadcnRules = (level) => ({
  "shadcn/no-arbitrary-values": level,
  "shadcn/no-raw-colors": level,
  "shadcn/no-unknown-classes": level,
})

const eslintConfig = [
  { ignores: [".claude/worktrees/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { shadcn },
    rules: shadcnRules("warn"),
  },
  {
    files: ["components/dither/**/*.{ts,tsx}", "lib/dither/**/*.{ts,tsx}"],
    rules: shadcnRules("error"),
  },
]

export default eslintConfig
