# Dino IG

**Live on the Apple App Store.**

A social-media app where the accounts are dinosaurs and they answer back.

311 species have feeds, posts and comment threads. Kids can open a chat with any
of them and get replies in character, or leave a comment on a post and have
another dinosaur reply to it. Built as a pnpm monorepo: an Expo client, an
Express API, and a shared, code-generated contract between them.

---

## Architecture

```
lib/api-spec      OpenAPI schema — the single source of truth
      │
      ├── orval ──> lib/api-zod            generated request/response schemas
      └── orval ──> lib/api-client-react   generated typed React Query client
                          │
artifacts/mobile ─────────┘                Expo (iOS · Android · web)
artifacts/api-server                       Express 5 + Drizzle + PostgreSQL
lib/db                                     schema, migrations, drizzle-zod
```

The contract is written once and generated outward. Client types, server
validation schemas and the HTTP client all derive from the same OpenAPI
document, so a field renamed in the spec breaks compilation on both sides
instead of failing silently at runtime in front of a user.

---

## The parts worth reading

### Keeping an LLM in character, and inside the guardrails

Two distinct surfaces call the model, and they are deliberately not the same
prompt. A one-to-one chat gets a 200-token budget and a persona assembled at
request time from the dinosaur's own database row — name, period, diet,
description — with a personality mapped from its diet. Carnivores are intense
and dramatic, herbivores gentle and philosophical. In-feed comment replies get a
different prompt entirely and a 100-token budget, because a comment that reads
like an essay is a comment that reads like a bot.

The safety story is layered rather than a single filter:

- **Bounded input.** Every request passes a Zod schema before it reaches the
  model — a message is capped at 2,000 characters, history at 20 turns, and only
  the last 10 are actually forwarded. There is no path by which a client can
  grow the context indefinitely.
- **Prompt-level constraints.** The system prompt fixes register (kid-friendly,
  2–4 sentences), pins the character, and handles the awkward case explicitly:
  asked about anything modern, the dinosaur reacts in character rather than
  answering — *"What is a smartphone? Is it prey?"* Out-of-scope questions get
  deflected by the persona instead of breaking it.
- **A separate, tighter budget for chat.** Chat is rate-limited to 30 requests
  per hour against its own limiter, independent of the global 120/minute. The
  expensive, abusable surface cannot consume the budget of the cheap ones.
- **Upstream failures never leak.** A model error returns a flat `502` and the
  detail goes to the server log. The client is never handed a provider error
  string to render.

### Four rate limits, not one

`globalLimiter` 120/min · `chatLimiter` 30/hour · `likeLimiter` 60/min ·
`fetchImageLimiter` 10/min. Each surface has a different cost and a different
abuse profile, so each gets its own budget. One shared limiter would let a
like-spam loop starve the thing that actually costs money.

### Identity without accounts

There is no login. Requests are attributed via `x-device-id` when the client
provides one, and otherwise fall back to a SHA-256 of IP plus user-agent. That
gives a stable key for rate limiting and like-deduplication without asking a
child for an email address, and without storing anything that identifies a
person.

### Auth that refuses to boot when misconfigured

```ts
if (isProd && !API_KEY) {
  throw new Error("API_KEY must be set in production to protect mutation routes");
}
```

Mutation routes are key-guarded, and in production a missing key is a startup
crash rather than a warning. The failure mode of a forgotten environment
variable should be an app that doesn't start, not an app that quietly serves
open write endpoints.

### Getting 311 fossil images out of Wikipedia without being blocked

Image resolution is a three-stage fallback. Ask the Wikipedia API for the page
image by exact title; if the title doesn't exist — Wikipedia signals this with
`pageid: "-1"` or a `missing` flag rather than an error — fall back to a Commons
search for `<name> dinosaur`, then re-query the top hit for its page image.

Everything downloaded is then localised. `downloadWikiImages.ts` throttles at
400 ms between requests, identifies itself with a descriptive User-Agent per
[Wikimedia's policy](https://meta.wikimedia.org/wiki/User-Agent_policy), skips
files already on disk, and only rewrites rows still pointing at Wikimedia — so
it is safely resumable and re-runnable. After one pass the API serves all 311
images as static files and the app stops touching Wikimedia entirely.

The caching path is defensive about what it accepts: a content-type allowlist,
and a 5 MiB ceiling checked against both the `content-length` header *and* the
downloaded buffer, because the header is a claim rather than a fact. Any failure
returns null and the caller falls back to hotlinking, so a bad cache write
degrades the experience instead of breaking the screen.

### A User-Agent bug that only appears on phones

Wikimedia's policy rejects the default user-agents of mobile HTTP clients —
`okhttp` on Android, `CFNetwork` on iOS. Images that loaded perfectly on web
returned 403 on device. `resolveImageSource()` attaches a compliant User-Agent
to Wikimedia URLs only, and separately resolves relative paths to absolute ones,
because native builds run outside the web proxy and cannot use `/api/...`
directly.

---

## Stack

**Runtime** Node 24 · TypeScript 5.9 · pnpm workspaces
**API** Express 5 · Drizzle ORM · PostgreSQL · Zod (`zod/v4`) · drizzle-zod · esbuild
**Client** Expo · React Native (iOS, Android, web) · React Query
**Contract** OpenAPI + Orval codegen
**Model** MiniMax-Text-01
**Billing** RevenueCat

## Layout

```
artifacts/
  api-server/       Express API — dinosaurs, chat, likes, image resolution
  mobile/           Expo app — feed, search, detail, chat, paywall
  mockup-sandbox/   component sandbox
lib/
  db/               Drizzle schema + drizzle-zod
  api-spec/         OpenAPI document + Orval config
  api-zod/          generated schemas
  api-client-react/ generated typed client
scripts/            seeding, image ingestion, RevenueCat setup
```

## Running it

```bash
pnpm install
# DATABASE_URL, MINIMAX_API_KEY, API_KEY
pnpm --filter @workspace/scripts exec tsx ./src/seedDinosaurs.ts
pnpm --filter @workspace/scripts exec tsx ./src/downloadWikiImages.ts
```
