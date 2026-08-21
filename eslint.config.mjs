import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

const eslintConfig = [
  { ignores: [".claude/worktrees/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
]

export default eslintConfig
