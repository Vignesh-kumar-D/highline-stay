# Booking + OTP — local setup

This document covers the email-OTP booking flow added on top of the React site.

## Architecture

- **Frontend**: Vite + React (this repo, `src/`)
- **API**: Cloudflare Worker (`worker/`) + Cloudflare D1 (SQLite)
- **Email**: [Resend](https://resend.com) HTTP API (`POST /emails`)

```
[Browser] -> [Vite dev :5173]  --(/api/* proxied)-->  [Worker :8787]  ->  [D1 local sqlite]
                                                              |
                                                              +-->  [Resend] (only if keys configured)
```

**Production (single Worker):** `wrangler.toml` has **`[build] command = "npm run build"`**, so `npx wrangler deploy` / `npm run deploy` runs Vite first and `./dist/` always exists—even if CI only invokes Wrangler (no separate build step). Wrangler **[assets]** serves the SPA with **SPA fallback**; only `/api/*` hits `worker/index.js`. Same `*.workers.dev` origin lets `VITE_API_BASE_URL` stay empty (`/api/...`).

The frontend never talks to Resend directly. The Worker holds the API key.

---

## What you need from Resend

Two values in **`.dev.vars`** (local) and as **Worker secrets** (production):

1. **`RESEND_API_KEY`**
   - In [Resend](https://resend.com): **API Keys** → create a key (starts with `re_`).
   - [Resend API docs — send email](https://resend.com/docs/api-reference/emails/send-email)

2. **`FROM_EMAIL`** (`wrangler.toml` → `[vars]`) must use an address **Resend allows** for sending:
   - **Sandbox/testing:** This repo defaults **`FROM_EMAIL = onboarding@resend.dev`**. Resend may only deliver **to** addresses they allow in that mode (often your Resend account email or addresses you add in the dashboard).
   - **Production:** add and verify **your domain** in Resend, then set `FROM_EMAIL` (and optional `FROM_NAME`) to an address on that domain — you cannot send *from* `@gmail.com` through Resend unless Google’s domain is verified in *your* Resend account (normally you use your own domain).

That's it. Optional values that already have sane defaults: `FROM_NAME`, `OTP_EXPIRY_MINUTES`, `OTP_MAX_ATTEMPTS`, `ALLOWED_ORIGINS`, `TEST_MODE`.

---

## One-time local setup

```bash
# 1. Install deps (already done, but if you cloned fresh)
npm install

# 2. Copy env templates
cp .dev.vars.example .dev.vars
cp .env.example .env.local   # optional; vite proxy works without it

# 3. (Optional, for real email) edit .dev.vars and paste:
#    RESEND_API_KEY=re_xxxxxxxxxxxxxxx
#    OTP_PEPPER=any-long-random-string

# 4. Apply D1 migrations to the LOCAL sqlite store
npm run db:migrate:local

# 5. Sanity-check the schema exists
npm run db:list:local
# expect: otp_challenges, bookings, _cf_KV (sometimes), d1_migrations
```

> Note: `wrangler.toml` has `database_id = "REPLACE_WITH_REAL_D1_ID_AFTER_CREATE"`.
> For **local** development that is fine — wrangler ignores it and uses a local SQLite file.
> Before deploying to Cloudflare you'll create a real D1 with `wrangler d1 create highline-stay`
> and paste the returned id into `wrangler.toml`.

## Run locally

Two terminals (or `npm run dev:all`):

```bash
# Terminal A — Worker on http://127.0.0.1:8787
npm run dev:worker

# Terminal B — Vite on http://localhost:5173
npm run dev
```

Vite is configured to proxy `/api/*` to the Worker, so the React code can just call `/api/otp/send` etc.

### Test mode (no Resend yet)

`wrangler.toml` ships with `TEST_MODE = "true"`. While it is `true`:

- If `RESEND_API_KEY` is missing, the Worker logs the OTP to its terminal and **also returns it in the response** (`devCode`). The frontend modal will display it as "Test code".
- This lets you exercise the entire flow before Resend is configured.
- **Set `TEST_MODE = "false"` before deploying to production.**

### End-to-end smoke test

1. Open http://localhost:5173.
2. Pick check-in / check-out, click **Check Availability**.
3. Enter an email, click **Send verification code**.
4. Either look at the modal (Test mode) or your inbox (Resend).
5. Type the 6 digits, click **Verify & confirm**.
6. You'll see a booking reference (e.g. `HLS-AB23X9`) and a **View booking** button that opens `/booking/HLS-...`.

---

## Production deploy (later, when ready)

```bash
# 1. Create remote D1
npx wrangler d1 create highline-stay
# paste the returned id into wrangler.toml -> [[d1_databases]].database_id

# 2. Apply schema remotely
npm run db:migrate:remote

# 3. Set Worker secrets (interactive)
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put OTP_PEPPER

# 4. Update [vars] in wrangler.toml
#    - TEST_MODE = "false"
#    - ALLOWED_ORIGINS includes any browser origin that calls your API cross-origin (optional if UI and API share the same Worker hostname)

# 5. Deploy (runs `npm run build` via wrangler [build], then uploads worker + assets)
npm run deploy
# or equivalently:
# npx wrangler deploy

# Split hosting (optional): if the UI lived on Pages and the API on Workers, you'd set VITE_API_BASE_URL
# and add that Pages URL to ALLOWED_ORIGINS. With assets on the Worker this is not required.
```

---

## API contract

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/otp/send` | `{ email, checkIn, checkOut, adults, children }` | `{ ok, expiresInMinutes, emailSent, [devCode] }` |
| POST | `/api/otp/verify` | `{ email, code }` | `{ ok, bookingRef, booking }` |
| GET  | `/api/bookings/:ref` | – | `{ ok, booking }` |
| GET  | `/api/health` | – | `{ ok, status }` |

Hardening already in place:

- 3 OTP sends per email per hour
- 5 wrong attempts per challenge, then must request a new one
- 10-minute OTP expiry
- OTP stored only as `SHA-256(pepper + salt + code)` plus a per-row salt
- CORS allowlist via `ALLOWED_ORIGINS`
- Booking reference uses an unambiguous alphabet (no `O`/`0`/`I`/`1`)
