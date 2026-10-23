# v1/v2/v3 portfolio case study: Turborepo migration plan

Issue: #98. Status: plan only. Running the script restructures the whole repo, so
it is a separate, deliberate step (see "Ordered plan").

## Goal

Show how the site evolved by deploying three browseable versions (v1, v2, v3),
then link them from `data/projects/2-findmalek.mdx`.

## Version mapping

| Label | Git tag      | Date       | Stack at that tag                             | Env / live APIs at build                                                |
| ----- | ------------ | ---------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| v1    | `v0.4.2`     | 2023-10-14 | Next 13.5, package name `findservices`        | none at build; `/api` mail route needs SMTP vars at runtime             |
| v2    | `v2.0.0`     | 2025-04-19 | Next 15.2.4, zod env validation               | 9 vars required at build, Spotify is called while prerendering `/about` |
| v3    | `main` today | -          | Next 16.2.12, Node >= 22, content-collections | see `.env.example`                                                      |
| -     | `v2.1.0`     | 2025-10-15 | minor v2 refresh, not deployed separately     | -                                                                       |

`v3.0.0` (2026-08-15) and `v3.1.0` (2026-09-30) also exist. v3 is built from
the moved `main` code, not from a tag, so it keeps evolving until the next
redesign. When that redesign lands, tag it and snapshot the old v3 as a new app
instead of editing `apps/v3` in place.

## Structure

```text
.
├── apps/
│   ├── v1/          # exported from v0.4.2 (frozen)
│   ├── v2/          # exported from v2.0.0 (frozen)
│   └── v3/          # current app, moved from the repo root with git mv
├── package.json     # root: turbo only
├── pnpm-workspace.yaml   # packages: apps/*, sharedWorkspaceLockfile: false
├── turbo.json
├── scripts/bootstrap-turborepo.sh
└── .github/, .cursor/, docs/, CLAUDE.md, README.md, SECURITY.md   # stay at root
```

`sharedWorkspaceLockfile: false` is what keeps v1/v2 frozen. With the default
shared lockfile, pnpm re-resolves every caret range into one root lockfile.
Tested in a sandbox clone: v2 stopped type-checking and v3 failed to build
(`SiLinkedin` missing from a newer `react-icons`) until each app got its own
lockfile back.

## The script

```bash
./scripts/bootstrap-turborepo.sh --dry-run   # prints the plan, changes nothing
./scripts/bootstrap-turborepo.sh
```

- refuses to run on `main`/`master`, on a branch that does not contain `main`,
  on a dirty tree, or if the tags are missing
- exports the tags with `git archive` (no checkout, nothing deleted), moves the
  app with `git mv` so history follows, never commits
- no-op when `apps/v1`, `apps/v2` and `apps/v3` already exist; refuses on a
  half-done `apps/`
- v1/v2 get unique package names (`@findmalek/website-v1`, `-v2`) and lose
  their `lint` script (v1 has no eslint config, `next lint` would prompt in CI)
- rollback before committing: `git reset --hard HEAD && git clean -fd apps`

## What breaks when the app moves to `apps/v3`

| Thing                                                                                        | Impact                                                                                                      | Fix                                                                                 |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Vercel project `findmalek` (prod, www.findmalek.com)                                         | builds from the repo root, which no longer has a Next app                                                   | set Root Directory to `apps/v3` before merging the move                             |
| `.github/workflows/ci.yml`                                                                   | install and turbo at the root still work; filtered to `@findmalek/website` so v2's Spotify build is not run | filter already added in this PR; add separate jobs only if v1/v2 should build in CI |
| `.cursor/rules/*.mdc`, `CLAUDE.md`, `README.md`                                              | paths like `actions/`, `data/`, `pnpm dev` assume the root                                                  | update paths and commands after the move                                            |
| worktree workflow rule                                                                       | `ln -s .env.local` and `pnpm install` now target `apps/v3` for env, root for install                        | update `03-worktree-workflow.mdc`                                                   |
| `.env.local`                                                                                 | untracked, lives at root                                                                                    | script copies it to `apps/v3/.env.local`; delete the root copy yourself             |
| `.gitignore`                                                                                 | patterns are root-anchored (`/node_modules`, `/.next/`)                                                     | script copies it to `apps/v3`                                                       |
| `@/` alias, `content-collections` path, `public/`, `data/`, `evals/`, `/cv.pdf`, chat routes | relative to `tsconfig.json`/`next.config.ts`, which move together                                           | no change expected; verified by a sandbox build of v3                               |
| root `pnpm format`/`prettier`                                                                | `prettier` is a v3 devDependency                                                                            | run from `apps/v3` or add a root script                                             |
| stale root `node_modules`                                                                    | confuses the new install                                                                                    | delete it yourself, the script does not                                             |

Sandbox result (fresh clone, script run for real, `pnpm install`,
`SKIP_ENV_VALIDATION=true turbo run build`): v1 builds, v3 builds, v2 does not
without real secrets (see below).

## Env vars and live APIs

- v1: only the `/api` mail route reads `SENDER_EMAIL`, `SENDER_PASSWORD`,
  `MAIN_EMAIL` (runtime). Safest to drop or stub the route, it is a public form
  endpoint on a forgotten deployment.
- v2: `env.ts` has no skip flag and requires `SPOTIFY_*`, `GITHUB_TOKEN`,
  `GROQ_API_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_*`. Prerendering `/about` calls
  Spotify, so the build fails with dummy values.
- Decision needed (still open in #98): live keys per Vercel project, or replace
  the Spotify/GitHub fetches in v2 with build-time fixtures. "Frozen" means the
  second option. Scoped as its own task, not done by the script.
- Do not copy the prod secrets into three projects without a decision on key
  rotation and read-only scopes.

## Domains

Option 1 `v1.findmalek.com` (and v2, v3) is the simplest: `www.findmalek.com` is
the site, the apex DNS is already in Vercel, and each subdomain is one CNAME plus
a domain on its Vercel project. Options 2 and 3 need DNS in other zones and the
`*.malek.engineering` convention is not documented in this repo, so it is not
recommended here. Final pick is Malek's call. Whatever is chosen, add the
domains to `images.remotePatterns` / `NEXT_PUBLIC_APP_URL` of the matching
project.

## Ordered plan

1. Merge this PR (script, plan, CI filter, `dev` task). No behaviour change on prod.
2. Decide: domain scheme, live APIs vs fixtures for v2, drop the v1 mail route.
3. New branch from `main` via `gh issue develop 98 --checkout`.
4. `--dry-run`, then run the script, `pnpm install`, `turbo run build` per app.
5. Fix v2 (fixtures or env) and v1 (mail route). Frozen apps get no other changes.
6. Update `.cursor/rules`, `README.md`, `CLAUDE.md`, worktree rule for the new layout.
7. In Vercel: set Root Directory of the existing `findmalek` project to `apps/v3`
   and confirm a preview builds from the PR branch first.
8. Create two new Vercel projects (Root Directory `apps/v1`, `apps/v2`), env vars,
   domains, DNS.
9. Merge the move PR, confirm prod redeploys, then update
   `data/projects/2-findmalek.mdx` with the live links.

Effort: script and CI about half a day (done), v2 fixtures about half a day,
Vercel/DNS/docs about half a day, plus review. Roughly 1.5 to 2 days.

## Risks

- Prod deploy breaks if the Root Directory change and the merge are not
  coordinated (step 7 before step 9).
- Three Next majors (13, 15, 16) in one repo: `turbo run build` without a filter
  builds all of them, one install holds three dependency trees, old
  dependencies will collect security advisories.
- Secrets and API quotas multiplied by three Vercel projects.
- Old v1 mail route stays publicly reachable.

## Acceptance criteria

- [ ] `apps/v1`, `apps/v2`, `apps/v3` build independently.
- [ ] Each version deploys to its own subdomain.
- [ ] Meta case-study links to all three live versions.
- [ ] Prod `www.findmalek.com` is unaffected and still deploys from `apps/v3`.

## Out of scope

- Ongoing dependency or security updates for v1/v2 after the first deployment.
- Blog or case-study content changes beyond the link update.
- Shared packages between versions.
