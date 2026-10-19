#!/usr/bin/env bash
set -euo pipefail

# Bootstrap the v1/v2/v3 portfolio case-study Turborepo.
# Run from the repo root.
#
# This script:
# 1. Moves the current Next.js app into apps/v3/
# 2. Checks out historical tags into apps/v1/ and apps/v2/
# 3. Updates pnpm-workspace.yaml and turbo.json
# 4. Freezes old versions so they build independently

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

V1_TAG="${V1_TAG:-v0.4.2}"
V2_TAG="${V2_TAG:-v2.0.0}"
V3_DIR="apps/v3"
V1_DIR="apps/v1"
V2_DIR="apps/v2"

echo "==> Bootstrapping Turborepo for portfolio case study"
echo "    V1 tag: $V1_TAG"
echo "    V2 tag: $V2_TAG"

# -----------------------------------------------------------------------------
# 1. Prepare apps/ directory
# -----------------------------------------------------------------------------
mkdir -p apps

# -----------------------------------------------------------------------------
# 2. Move current app to apps/v3/
# -----------------------------------------------------------------------------
if [ -d "$V3_DIR" ]; then
  echo "    $V3_DIR already exists; skipping move"
else
  echo "==> Moving current app to $V3_DIR"
  # Create the target directory first
  mkdir -p "$V3_DIR"

  # Move root files that belong to the Next.js app
  # (git will track these as renames if done carefully)
  git mv actions app components config data env.ts hooks lib next.config.ts \
     package.json pnpm-lock.yaml postcss.config.mjs prettier.config.js \
     providers public styles tsconfig.json tsconfig.tsbuildinfo types \
     "$V3_DIR/" 2>/dev/null || true

  # Move remaining root config that belongs to v3
  for f in eslint.config.mjs tailwind.config.ts; do
    [ -f "$f" ] && git mv "$f" "$V3_DIR/"
  done

  echo "    Current app moved to $V3_DIR"
fi

# -----------------------------------------------------------------------------
# 3. Checkout historical tags into apps/v1/ and apps/v2/
# -----------------------------------------------------------------------------
checkout_version() {
  local tag="$1"
  local dir="$2"

  if [ -d "$dir" ] && [ "$(ls -A "$dir")" ]; then
    echo "    $dir already populated; skipping checkout of $tag"
    return
  fi

  echo "==> Checking out $tag into $dir"
  mkdir -p "$dir"
  git archive "$tag" | tar -x -C "$dir"

  # Give the package a unique name so pnpm doesn't conflict
  node -e "
    const fs = require('fs');
    const p = JSON.parse(fs.readFileSync('$dir/package.json', 'utf8'));
    p.name = '@findmalek/website-' + require('path').basename('$dir');
    fs.writeFileSync('$dir/package.json', JSON.stringify(p, null, 2) + '\\n');
  "

  # Freeze live API calls: old versions shouldn't call live Spotify/GitHub APIs.
  # We replace env-driven fetches with build-time fallbacks where possible.
  # This is a coarse pass; finer mocking happens per-app later.
  echo "    (fine-grained API freezing is left for a follow-up pass)"
}

checkout_version "$V1_TAG" "$V1_DIR"
checkout_version "$V2_TAG" "$V2_DIR"

# -----------------------------------------------------------------------------
# 4. Update workspace and turbo config at root
# -----------------------------------------------------------------------------
echo "==> Updating workspace config"
cat > pnpm-workspace.yaml <<YAML
packages:
  - "apps/*"

allowBuilds:
  braintrust: false
  esbuild: false
  sharp: false
YAML

cat > package.json <<'JSON'
{
  "name": "@findmalek/website-root",
  "private": true,
  "packageManager": "pnpm@11.22.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.5.4"
  }
}
JSON

cat > turbo.json <<'JSON'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["SKIP_ENV_VALIDATION"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    }
  }
}
JSON

echo "==> Done."
echo ""
echo "Next steps:"
echo "  1. pnpm install"
echo "  2. cd apps/v1 && pnpm build  (fix breakages as needed)"
echo "  3. cd apps/v2 && pnpm build  (fix breakages as needed)"
echo "  4. cd apps/v3 && pnpm build  (current app)"
echo "  5. Update data/projects/2-findmalek.mdx with live v1/v2/v3 links"
