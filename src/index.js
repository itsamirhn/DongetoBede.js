import DatabaseClient from './database/client.js';
import { setBotToken } from './utils/telegram.js';
import {
    handleStart,
    handleSetCard,
    handleHelp,
    handleCancel,
    handleText,
    handleInline,
    handleInlineResult,
    handleCallback
} from './handlers.js';

export default {
    async fetch(request, env, ctx) {
        try {
            if (request.method !== 'POST') {
                return new Response('Method not allowed', { status: 405 });
            }

            if (env.TELEGRAM_WEBHOOK_SECRET) {
                const providedSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
                if (providedSecret !== env.TELEGRAM_WEBHOOK_SECRET) {
                    return new Response('Unauthorized', { status: 401 });
                }
            }

            const update = await request.json();
            const db = new DatabaseClient(env.DB);
            setBotToken(env.TELEGRAM_BOT_TOKEN);

            let result = { success: false };

            if (update.message) {
                result = await this.handleMessage(db, update, env.BOT_USERNAME);
            } else if (update.inline_query) {
                result = await handleInline(db, update, env);
            } else if (update.chosen_inline_result) {
                result = await handleInlineResult(db, update);
            } else if (update.callback_query) {
                result = await handleCallback(db, update);
            }

            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Error processing webhook:', error);
            return new Response('Internal server error', { status: 500 });
        }
    },

    async handleMessage(db, update, botUsername) {
        const message = update.message;
        const text = message.text;

        if (text && text.startsWith('/')) {
            const command = text.split(' ')[0].substring(1).toLowerCase();

            switch (command) {
                case 'start':
                    return await handleStart(db, update);
                case 'setcard':
                    return await handleSetCard(db, update);
                case 'help':
                    return await handleHelp(db, update, botUsername);
                case 'cancel':
                    return await handleCancel(db, update);
                default:
                    return await handleHelp(db, update, botUsername);
            }
        }

        if (text) {
            return await handleText(db, update);
        }

        return { success: true, message: 'Message type not handled' };
    }
}; 