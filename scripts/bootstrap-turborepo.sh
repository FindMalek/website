#!/usr/bin/env bash
# Bootstrap the v1/v2/v3 portfolio case-study Turborepo (issue #98).
#
#   ./scripts/bootstrap-turborepo.sh --dry-run   print the plan, change nothing
#   ./scripts/bootstrap-turborepo.sh             run it
#
# Moves the current app into apps/v3 with `git mv` (history is kept) and
# exports the v1/v2 tags into apps/v1 and apps/v2 with `git archive`. The
# working tree is never checked out to another ref, nothing is deleted, and
# nothing is committed. Run it on a clean topic branch cut from main.
#
# Override tags with V1_TAG / V2_TAG. Works on macOS bash 3.2.

set -euo pipefail

V1_TAG="${V1_TAG:-v0.4.2}"
V2_TAG="${V2_TAG:-v2.0.0}"
DRY_RUN=0

# Tracked top-level entries that stay at the repo root. Everything else
# tracked at the root belongs to the app and moves to apps/v3.
KEEP="
.cursor
.claude
.github
.gitignore
CLAUDE.md
README.md
SECURITY.md
docs
scripts
turbo.json
pnpm-workspace.yaml
"

die() {
  echo "error: $*" >&2
  exit 1
}

for arg in "$@"; do
  case "$arg" in
    --dry-run | -n) DRY_RUN=1 ;;
    -h | --help)
      sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) die "unknown argument: $arg" ;;
  esac
done

is_kept() {
  case "$KEEP" in
    *"
$1
"*) return 0 ;;
  esac
  return 1
}

# run <cmd...>: execute, or just print under --dry-run
run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "    [dry-run] $*"
  else
    "$@"
  fi
}

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null)" || die "not inside a git repo"
cd "$ROOT_DIR"

# -----------------------------------------------------------------------------
# Preflight (read-only)
# -----------------------------------------------------------------------------
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
case "$BRANCH" in
  main | master | HEAD) die "run this on a topic branch cut from main, not '$BRANCH'" ;;
esac
git rev-parse --verify --quiet main >/dev/null || die "local 'main' branch not found"
git merge-base --is-ancestor main HEAD || die "branch '$BRANCH' does not contain main, rebase on main first"

[ -z "$(git status --porcelain)" ] || die "working tree is not clean, commit or stash first"

for tag in "$V1_TAG" "$V2_TAG"; do
  git rev-parse --verify --quiet "refs/tags/$tag^{commit}" >/dev/null ||
    die "tag '$tag' not found (try: git fetch --tags)"
done
command -v node >/dev/null || die "node is required"
command -v tar >/dev/null || die "tar is required"

# Idempotent: already bootstrapped -> nothing to do.
if [ -f apps/v1/package.json ] && [ -f apps/v2/package.json ] && [ -f apps/v3/package.json ]; then
  echo "apps/v1, apps/v2 and apps/v3 already exist, nothing to do."
  exit 0
fi
# Partial state from an earlier run: refuse rather than guess.
if [ -e apps ]; then
  die "apps/ exists but is incomplete. Undo with: git reset --hard HEAD && git clean -fd apps  (review first), then rerun"
fi
[ -f package.json ] || die "no package.json at the repo root, nothing to move"

MOVE_LIST=""
while IFS= read -r entry; do
  [ -n "$entry" ] || continue
  is_kept "$entry" && continue
  MOVE_LIST="$MOVE_LIST$entry
"
done <<EOF
$(git ls-tree --name-only HEAD)
EOF

# -----------------------------------------------------------------------------
# Plan
# -----------------------------------------------------------------------------
echo "==> Plan (branch: $BRANCH, dry-run: $DRY_RUN)"
echo "    apps/v1  <- git archive $V1_TAG ($(git log -1 --format=%ad --date=short "$V1_TAG^{commit}"))"
echo "    apps/v2  <- git archive $V2_TAG ($(git log -1 --format=%ad --date=short "$V2_TAG^{commit}"))"
echo "    apps/v3  <- git mv of these root entries:"
printf '%s' "$MOVE_LIST" | sed 's/^/                 /'
echo "    root     <- new package.json, pnpm-workspace.yaml (apps/*, per-app lockfiles); turbo.json, .gitignore kept"
echo "    .gitignore is also copied to apps/v3 (its patterns are root-anchored)"
echo

# -----------------------------------------------------------------------------
# 1. Export old tags to a temp dir first, so a failure leaves the repo untouched
# -----------------------------------------------------------------------------
if [ "$DRY_RUN" -eq 1 ]; then
  STAGE="<tmp>"
  echo "==> Would export $V1_TAG and $V2_TAG with git archive"
else
  STAGE="$(mktemp -d "${TMPDIR:-/tmp}/bootstrap-turborepo.XXXXXX")"
  echo "==> Exporting tags to $STAGE"
  mkdir -p "$STAGE/v1" "$STAGE/v2"
  git archive --format=tar "$V1_TAG" | tar -x -C "$STAGE/v1"
  git archive --format=tar "$V2_TAG" | tar -x -C "$STAGE/v2"
  [ -f "$STAGE/v1/package.json" ] || die "$V1_TAG has no package.json"
  [ -f "$STAGE/v2/package.json" ] || die "$V2_TAG has no package.json"

  # Unique workspace names; drop `lint` from the frozen snapshots (v1 has no
  # eslint config so `next lint` would prompt in CI).
  for v in v1 v2; do
    PKG="$STAGE/$v/package.json" NAME="@findmalek/website-$v" node -e '
      const fs = require("fs")
      const f = process.env.PKG
      const p = JSON.parse(fs.readFileSync(f, "utf8"))
      p.name = process.env.NAME
      p.private = true
      if (p.scripts) delete p.scripts.lint
      fs.writeFileSync(f, JSON.stringify(p, null, 2) + "\n")
    '
  done
fi

# -----------------------------------------------------------------------------
# 2. Move the current app, install snapshots, write root config
# -----------------------------------------------------------------------------
echo "==> Moving current app to apps/v3"
run mkdir -p apps/v3
while IFS= read -r entry; do
  [ -n "$entry" ] || continue
  run git mv -- "$entry" "apps/v3/$entry"
done <<EOF
$MOVE_LIST
EOF
run cp .gitignore apps/v3/.gitignore
if [ -f .env.local ]; then
  run cp .env.local apps/v3/.env.local
fi

echo "==> Installing snapshots"
run mv "$STAGE/v1" apps/v1
run mv "$STAGE/v2" apps/v2

echo "==> Writing root workspace config"
if [ "$DRY_RUN" -eq 1 ]; then
  echo "    [dry-run] write package.json, pnpm-workspace.yaml"
else
  PM="$(node -p 'require("./apps/v3/package.json").packageManager || ""')"
  TURBO="$(node -p 'require("./apps/v3/package.json").devDependencies.turbo || "^2.5.4"')"
  PM="$PM" TURBO="$TURBO" node -e '
    const fs = require("fs")
    const pkg = {
      name: "@findmalek/website-root",
      private: true,
      ...(process.env.PM ? { packageManager: process.env.PM } : {}),
      scripts: {
        build: "turbo run build",
        lint: "turbo run lint",
        dev: "turbo run dev --filter=@findmalek/website",
      },
      devDependencies: { turbo: process.env.TURBO },
    }
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n")
  '
  cat >pnpm-workspace.yaml <<'YAML'
packages:
  - "apps/*"

# each app keeps its own lockfile, so v1/v2 stay pinned to their tag
sharedWorkspaceLockfile: false

allowBuilds:
  "@parcel/watcher": false
  braintrust: false
  esbuild: false
  sharp: false
  unrs-resolver: false
YAML
fi

echo
if [ "$DRY_RUN" -eq 1 ]; then
  echo "==> Dry run finished, nothing was changed."
  exit 0
fi

cat <<EOF
==> Done. Nothing was committed.

Next steps:
  1. rm -rf node_modules             (stale root install, remove yourself)
  2. pnpm install                    (per-app lockfiles + a small root one for turbo;
                                      apps/v1/pnpm-lock.yaml is rewritten to the new format)
  3. pnpm exec turbo run build --filter=@findmalek/website-v1   (then v3; v2 needs
     the real Spotify/GitHub/Groq/Resend env vars at build time)
  4. Update .github/workflows/ci.yml and the Vercel project Root Directory
     (see docs/turborepo-migration.md) BEFORE merging.

Rollback (before committing):
  git reset --hard HEAD && git clean -fd apps && git status
EOF
