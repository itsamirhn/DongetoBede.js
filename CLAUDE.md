# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DongetoBede.js is a **Telegram bot for managing shared expenses ("dong")** in Persian. It runs on **Cloudflare Workers** with a **D1 (SQLite) database** and uses **Workers AI (Llama-3-8B)** for parsing Persian text in inline queries. Zero external npm dependencies — only Cloudflare platform APIs.

## Commands

```bash
bun install                     # Install devDependencies (wrangler)
bun deploy:staging              # Deploy to staging worker
bun deploy:production           # Deploy to production worker
bun tail:staging                # Stream live logs from staging
bun tail:production             # Stream live logs from production
bun db:init:staging             # Initialize staging D1 database schema
bun db:init:production          # Initialize production D1 database schema
```

There are no tests, linting, or build steps configured. Code is plain JavaScript (ES modules) deployed directly via Wrangler.

## Architecture

**Entry point**: `src/index.js` — Cloudflare Worker fetch handler that validates the webhook secret header, then routes Telegram updates by type:

- **Commands** (`/start`, `/setcard`, `/help`, `/cancel`) and **text messages** → `src/handlers.js`
- **Inline queries** → AI-powered parsing of amount/card number, generates split options for 2–15 people
- **Chosen inline results** → Creates dong records in D1
- **Callback queries** → Toggles user payment status on dong buttons

**State machine**: Users have a `state` field (`''` = default, `'setcard'` = awaiting card number input). Managed in `handleText()`.

### Key modules

- `src/constants.js` — All Persian UI messages, button labels, regex patterns, AI prompt config
- `src/database/client.js` — D1 wrapper with parameterized queries for users and dongs tables
- `src/utils/telegram.js` — Telegram Bot API wrapper (sendMessage, editMessage, answerInlineQuery, etc.)
- `src/utils/formatting.js` — Per-person cost calculation and dong summary text/markup generation
- `src/utils/persian.js` — Persian ↔ English digit conversion
- `src/utils/user.js` — Extract user from update types, auto-create in DB

### Database schema (`schema.sql`)

- **users**: id, first_name, last_name, username, card_number, state, timestamps
- **dongs**: id, issuer_user_id (FK), amount, card_number, total_people, paid_user_ids (JSON array), message_id, timestamps

## Environments

Configured in `wrangler.jsonc` with separate staging/production workers, each with its own D1 database and bot username. Secrets (TELEGRAM_BOT_TOKEN) are set via `bunx wrangler secret put`. CI/CD auto-deploys to production on push to `main`.

## Code Conventions

- All user-facing text is in Persian (defined in `constants.js` MESSAGES/BUTTONS)
- Card numbers are 16-digit Iranian bank card format, validated by regex
- Amounts displayed using Persian digits via utility functions
- No TypeScript, no bundler — plain ES module imports
