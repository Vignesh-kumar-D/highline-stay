# Booking + OTP — local setup

This document covers the email-OTP booking flow added on top of the React site.

## Architecture

- **Frontend**: Vite + React (this repo, `src/`)
- **API**: Cloudflare Worker (`worker/`) + Cloudflare D1 (SQLite)
- **Email**: SendGrid HTTP API (`v3/mail/send`)

```
[Browser] -> [Vite dev :5173]  --(/api/* proxied)-->  [Worker :8787]  ->  [D1 local sqlite]
                                                              |
                                                              +-->  [SendGrid] (only if keys configured)
```

The frontend never talks to SendGrid directly. The Worker holds the API key.

---

## What you give me from SendGrid

You will need exactly two values in your `.dev.vars` (local) and as Worker secrets (production):

1. **`SENDGRID_API_KEY`**
   - In SendGrid: **Settings → API Keys → Create API Key**
   - Permissions: choose **Restricted Access** and enable only **Mail Send → Full Access** (everything else can stay off).
   - Copy the value (`SG.xxxxx…`). You will not be able to view it again.

2. **A verified sender** so SendGrid will accept your `from` address.
   - Easiest: **Settings → Sender Authentication → Verify a Single Sender**
   - Use `dvigneshkumar3@gmail.com`. SendGrid will send a verification email to that address. Click the link.
   - Once verified, the Worker config can keep `FROM_EMAIL = dvigneshkumar3@gmail.com`.
   - (Better long-term: domain authentication on a custom domain — DKIM/SPF — but Single Sender is enough to test.)

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
#    SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
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

### Test mode (no SendGrid yet)

`wrangler.toml` ships with `TEST_MODE = "true"`. While it is `true`:

- If `SENDGRID_API_KEY` is missing, the Worker logs the OTP to its terminal and **also returns it in the response** (`devCode`). The frontend modal will display it as "Test code".
- This lets you exercise the entire flow before you've signed up for SendGrid.
- **Set `TEST_MODE = "false"` before deploying to production.**

### End-to-end smoke test

1. Open http://localhost:5173.
2. Pick check-in / check-out, click **Check Availability**.
3. Enter an email, click **Send verification code**.
4. Either look at the modal (Test mode) or your inbox (real SendGrid).
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
npx wrangler secret put SENDGRID_API_KEY
npx wrangler secret put OTP_PEPPER

# 4. Update [vars] in wrangler.toml
#    - TEST_MODE = "false"
#    - ALLOWED_ORIGINS = "https://your-pages-domain"

# 5. Deploy worker
npx wrangler deploy

# 6. Cloudflare Pages: connect this repo, set build = `npm run build`,
#    output dir = `dist`, env var VITE_API_BASE_URL = your worker URL.
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
