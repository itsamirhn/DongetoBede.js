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

## Quick Setup

### Prerequisites

- Cloudflare account
- Telegram bot token from [@BotFather](https://t.me/BotFather)
- Node.js and yarn

### Installation

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd dongetobede-js
   yarn install
   ```

2. **Login to Cloudflare**

   ```bash
   yarn wrangler login
   ```

3. **Create D1 Database**

   ```bash
   yarn wrangler d1 create dongetobede-db
   ```

   Copy the database ID and update `wrangler.jsonc` with your database ID.

4. **Initialize Database**

   ```bash
   yarn db:init
   ```

5. **Set Secrets**

   ```bash
   yarn wrangler secret put TELEGRAM_BOT_TOKEN
   yarn wrangler secret put TELEGRAM_WEBHOOK_SECRET
   ```

6. **Deploy**

   ```bash
   yarn deploy
   ```

7. **Set Webhook**

   ```bash
   curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "YOUR_WORKER_URL", "secret_token": "YOUR_WEBHOOK_SECRET"}'
   ```

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
