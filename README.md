# DongetoBede - JavaScript Version

This is a fully AI-generated JavaScript conversion of the original [DongetoBede](https://github.com/itsamirhn/DongetoBede) Go project, designed to be deployed for free on Cloudflare Workers.

A Telegram bot for managing shared expenses ("dong") with inline queries and payment tracking.

## Features

- 🤖 Telegram bot with inline queries
- 💰 Shared expense management
- 💳 Card number management
- 🔢 Mathematical expression support
- 🌐 Persian language support
- ⚡ Cloudflare Workers deployment
- 🗄️ D1 database storage
- 🔄 Multi-environment support (staging/production)

## Setup

### Prerequisites

- Cloudflare account
- Telegram bot tokens from [@BotFather](https://t.me/BotFather)
- [Bun](https://bun.sh)

### Installation

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd dongetobede-js
   bun install
   bunx wrangler login
   ```

2. **Create D1 Databases**

   ```bash
   bunx wrangler d1 create dongetobede-db-staging
   bunx wrangler d1 create dongetobede-db-production
   ```

   Update `wrangler.jsonc` with your database IDs.

3. **Initialize Databases**

   ```bash
   bun db:init:staging
   bun db:init:production
   ```

4. **Set Secrets**

   ```bash
   bunx wrangler secret put TELEGRAM_BOT_TOKEN --env staging
   bunx wrangler secret put TELEGRAM_WEBHOOK_SECRET --env staging
   bunx wrangler secret put TELEGRAM_BOT_TOKEN --env production
   bunx wrangler secret put TELEGRAM_WEBHOOK_SECRET --env production
   ```

5. **Deploy**

   ```bash
   bun deploy:staging
   bun deploy:production
   ```

6. **Set Webhooks**

   ```bash
   # Staging
   curl -X POST "https://api.telegram.org/botYOUR_STAGING_BOT_TOKEN/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "YOUR_STAGING_WORKER_URL", "secret_token": "YOUR_STAGING_WEBHOOK_SECRET"}'

   # Production
   curl -X POST "https://api.telegram.org/botYOUR_PRODUCTION_BOT_TOKEN/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "YOUR_PRODUCTION_WORKER_URL", "secret_token": "YOUR_PRODUCTION_WEBHOOK_SECRET"}'
   ```

## Development

### Available Commands

```bash
# Deploy
bun deploy:staging
bun deploy:production

# Database operations
bun db:init:staging
bun db:init:production

# Stream logs
bun tail:staging
bun tail:production
```

### Environment Switching

Simply add `:staging` or `:production` to any command to target the specific environment. Each environment has its own database, secrets, and deployment.

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
