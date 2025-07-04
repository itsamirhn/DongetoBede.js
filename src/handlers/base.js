// Base handler class
class BaseHandler {
    constructor(db) {
        this.db = db;
    }

    // Get user from context, create if not exists
    async getOrCreateUser(update) {
        const user = this.extractUserFromUpdate(update);
        if (!user) {
            throw new Error('No user found in update');
        }

        try {
            return await this.db.getUserById(user.id);
        } catch (error) {
            // User doesn't exist, create new user
            const newUser = {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                cardNumber: null,
                state: ''
            };
            await this.db.addUser(newUser);
            return newUser;
        }
    }

    // Extract user from different types of updates
    extractUserFromUpdate(update) {
        if (update.message && update.message.from) {
            return update.message.from;
        }
        if (update.callback_query && update.callback_query.from) {
            return update.callback_query.from;
        }
        if (update.inline_query && update.inline_query.from) {
            return update.inline_query.from;
        }
        if (update.chosen_inline_result && update.chosen_inline_result.from) {
            return update.chosen_inline_result.from;
        }
        return null;
    }

    // Send message using Telegram Bot API
    async sendMessage(chatId, text, options = {}) {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

        const payload = {
            chat_id: chatId,
            text: text,
            parse_mode: options.parse_mode || 'Markdown',
            ...options
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Telegram API error: ${response.status}`);
        }

        return response.json();
    }

    // Edit message using Telegram Bot API
    async editMessage(chatId, messageId, text, options = {}) {
        const url = `https://api.telegram.org/bot${this.botToken}/editMessageText`;

        const payload = {
            chat_id: chatId,
            message_id: messageId,
            text: text,
            parse_mode: options.parse_mode || 'Markdown',
            ...options
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Telegram API error: ${response.status}`);
        }

        return response.json();
    }

    // Answer inline query
    async answerInlineQuery(inlineQueryId, results, options = {}) {
        const url = `https://api.telegram.org/bot${this.botToken}/answerInlineQuery`;

        const payload = {
            inline_query_id: inlineQueryId,
            results: results,
            ...options
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Telegram API error: ${response.status}`);
        }

        return response.json();
    }

    // Answer callback query
    async answerCallbackQuery(callbackQueryId, options = {}) {
        const url = `https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`;

        const payload = {
            callback_query_id: callbackQueryId,
            ...options
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Telegram API error: ${response.status}`);
        }

        return response.json();
    }

    setBotToken(token) {
        this.botToken = token;
    }
}

export default BaseHandler; 