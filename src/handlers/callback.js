import BaseHandler from './base.js';
import { getDongText, getDongMarkup } from '../utils/formatting.js';

class CallbackHandler extends BaseHandler {
    async handle(update) {
        const user = await this.getOrCreateUser(update);
        const callbackQuery = update.callback_query;
        const callbackData = callbackQuery.data;

        if (!callbackData.startsWith('paydong')) {
            await this.answerCallbackQuery(callbackQuery.id, {
                text: 'عملیات نامعتبر'
            });
            return { success: false };
        }

        // Extract dong ID from callback data
        const dongIdMatch = callbackData.match(/paydong\|(.+)/);
        if (!dongIdMatch) {
            await this.answerCallbackQuery(callbackQuery.id, {
                text: 'عملیات نامعتبر'
            });
            return { success: false };
        }

        const dongId = dongIdMatch[1];

        try {
            // Get dong from database
            const dong = await this.db.getDongById(dongId);

            // Check if user already paid
            if (dong.paidUserIds.includes(user.id)) {
                // Remove user from paid list
                dong.paidUserIds = dong.paidUserIds.filter(id => id !== user.id);
                await this.db.updateDong(dong);

                await this.answerCallbackQuery(callbackQuery.id, {
                    text: 'دونگ شما پس گرفته شد!'
                });
            } else {
                // Add user to paid list
                dong.paidUserIds.push(user.id);
                await this.db.updateDong(dong);

                await this.answerCallbackQuery(callbackQuery.id, {
                    text: 'دونگ شما ثبت شد!'
                });
            }

            // Get paid users for display
            const paidUsers = await this.db.getUsersByIds(dong.paidUserIds);

            // Update the message
            const newText = getDongText(dong.amount, dong.totalPeople, dong.cardNumber, paidUsers);
            const newMarkup = getDongMarkup(dong.paidUserIds.length, dong.totalPeople, dong.cardNumber, dong.id);

            // Edit the message (either inline message or regular message)
            if (callbackQuery.inline_message_id) {
                await this.editInlineMessage(
                    callbackQuery.inline_message_id,
                    newText,
                    { reply_markup: newMarkup }
                );
            } else {
                await this.editMessage(
                    callbackQuery.message.chat.id,
                    callbackQuery.message.message_id,
                    newText,
                    { reply_markup: newMarkup }
                );
            }

        } catch (error) {
            console.error('Error handling callback:', error);

            await this.answerCallbackQuery(callbackQuery.id, {
                text: 'خطا در ثبت پرداخت'
            });
        }

        return { success: true };
    }

    // Edit inline message using Telegram Bot API
    async editInlineMessage(inlineMessageId, text, options = {}) {
        const url = `https://api.telegram.org/bot${this.botToken}/editMessageText`;

        const payload = {
            inline_message_id: inlineMessageId,
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
}

export default CallbackHandler; 