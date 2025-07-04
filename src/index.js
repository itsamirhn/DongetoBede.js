import DatabaseClient from './database/client.js';
import StartHandler from './handlers/start.js';
import SetCardHandler from './handlers/setcard.js';
import HelpHandler from './handlers/help.js';
import CancelHandler from './handlers/cancel.js';
import InlineHandler from './handlers/inline.js';
import InlineResultHandler from './handlers/inline-result.js';
import CallbackHandler from './handlers/callback.js';
import TextHandler from './handlers/text.js';

export default {
    async fetch(request, env, ctx) {
        try {
            // Only accept POST requests
            if (request.method !== 'POST') {
                return new Response('Method not allowed', { status: 405 });
            }

            // Verify webhook secret if configured
            if (env.TELEGRAM_WEBHOOK_SECRET) {
                const providedSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
                if (providedSecret !== env.TELEGRAM_WEBHOOK_SECRET) {
                    return new Response('Unauthorized', { status: 401 });
                }
            }

            // Parse the update from Telegram
            const update = await request.json();

            // Initialize database client
            const db = new DatabaseClient(env.DB);

            // Initialize handlers
            const handlers = {
                start: new StartHandler(db),
                setcard: new SetCardHandler(db),
                help: new HelpHandler(db),
                cancel: new CancelHandler(db),
                inline: new InlineHandler(db),
                inlineResult: new InlineResultHandler(db),
                callback: new CallbackHandler(db),
                text: new TextHandler(db)
            };

            // Set bot token for all handlers
            const botToken = env.TELEGRAM_BOT_TOKEN;
            Object.values(handlers).forEach(handler => {
                handler.setBotToken(botToken);
            });

            // Route the update to the appropriate handler
            let result = { success: false };

            if (update.message) {
                result = await this.handleMessage(update, handlers);
            } else if (update.inline_query) {
                result = await handlers.inline.handle(update);
            } else if (update.chosen_inline_result) {
                result = await handlers.inlineResult.handle(update);
            } else if (update.callback_query) {
                result = await handlers.callback.handle(update);
            } else {
                // console.log('Unhandled update type:', update);
            }

            return new Response(JSON.stringify(result), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error('Error processing webhook:', error);
            return new Response('Internal server error', { status: 500 });
        }
    },

    async handleMessage(update, handlers) {
        const message = update.message;
        const text = message.text;

        // Handle commands
        if (text && text.startsWith('/')) {
            const command = text.split(' ')[0].substring(1).toLowerCase();

            switch (command) {
                case 'start':
                    return await handlers.start.handle(update);
                case 'setcard':
                    return await handlers.setcard.handle(update);
                case 'help':
                    return await handlers.help.handle(update);
                case 'cancel':
                    return await handlers.cancel.handle(update);
                default:
                    // Unknown command, show help
                    return await handlers.help.handle(update);
            }
        }

        // Handle regular text messages
        if (text) {
            return await handlers.text.handle(update);
        }

        // Handle other message types (photos, documents, etc.)
        return { success: true, message: 'Message type not handled' };
    }
}; 