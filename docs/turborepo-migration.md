# v1/v2/v3 Portfolio Case Study — Turborepo Migration Plan

## Goal

Deploy three browseable versions of the portfolio (v1, v2, v3) under subdomains, then update the meta case-study page at `data/projects/2-findmalek.mdx` to link to all three.

## Version mapping

| Label | Git tag | Approx date | Description |
|---|---|---|---|
| v1 | `v0.4.2` | Oct 2023 | First complete portfolio rewrite |
| v2 | `v2.0.0` | Apr 2025 | Major redesign, early chat experiments |
| v3 | current `main` | Aug 2026 | Current version (what ships today) |
| — | `v2.1.0` | Oct 2025 | Minor v2 refresh, **not** deployed separately |

## Proposed subdomain scheme

Options:

1. `v1.findmalek.com`, `v2.findmalek.com`, `v3.findmalek.com`
2. `v1.archive.findmalek.engineer`, `v2.archive.findmalek.engineer`, `v3.archive.findmalek.engineer`
3. `v1.malek.engineering`, `v2.malek.engineering`, `v3.malek.engineering`

**Recommendation:** option 3 fits the existing `*.malek.engineering` convention used for client and side projects.

## Structure

```text
.
├── apps/
│   ├── v1/          # frozen snapshot from v0.4.2
│   ├── v2/          # frozen snapshot from v2.0.0
│   └── v3/          # current app (moved from root)
├── package.json     # root workspace manifest
├── pnpm-workspace.yaml
├── turbo.json
└── scripts/
    └── bootstrap-turborepo.sh
```

## Key constraints

- Each version keeps its own dependencies and lockfile. No shared package tree across versions.
- Old versions must be **frozen**: no live GitHub/Spotify API calls at runtime. Replace with build-time mocks or remove the features.
- Prod (`www.findmalek.com`) stays on Vercel. v1/v2/v3 can be hosted on Dokploy (#109) or Vercel separately.

## Migration script

Run:

```bash
./scripts/bootstrap-turborepo.sh
```

This script performs the move and checkouts. It is destructive — review with `git status` before committing.

## Acceptance criteria

- [ ] `apps/v1/`, `apps/v2/`, `apps/v3/` each build independently.
- [ ] Each version deploys to its own subdomain.
- [ ] Meta case-study links to all three live versions.
- [ ] Current prod site is unaffected.

## Out of scope

- Ongoing dependency/security updates for v1/v2 after initial deployment.
- Blog/case-study content changes outside the meta case-study link update.
