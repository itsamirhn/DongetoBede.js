import BaseHandler from './base.js';
import { getDongText, getDongMarkup } from '../utils/formatting.js';

class InlineResultHandler extends BaseHandler {
    async handle(update) {
        const user = await this.getOrCreateUser(update);
        const inlineResult = update.chosen_inline_result;

        if (!inlineResult) {
            return { success: false };
        }

        // Parse result ID (format: "amount-totalPeople")
        const parts = inlineResult.result_id.split('-');
        if (parts.length !== 2) {
            console.error('Invalid result ID format:', inlineResult.result_id);
            return { success: false };
        }

        const amount = parseInt(parts[0]);
        const totalPeople = parseInt(parts[1]);

        if (isNaN(amount) || isNaN(totalPeople)) {
            console.error('Invalid amount or totalPeople:', parts);
            return { success: false };
        }

        // Create dong in database
        const dong = {
            issuerUserId: user.id,
            amount: amount,
            cardNumber: user.cardNumber,
            totalPeople: totalPeople,
            paidUserIds: [user.id], // Issuer is automatically marked as paid
            messageId: inlineResult.inline_message_id
        };

        try {
            const dongId = await this.db.addDong(dong);
            dong.id = dongId;

            // Get issuer user info for display
            const paidUsers = [user];

            // Edit the message to show proper dong info with callback button
            const dongText = getDongText(dong.amount, dong.totalPeople, dong.cardNumber, paidUsers);
            const dongMarkup = getDongMarkup(dong.paidUserIds.length, dong.totalPeople, dong.cardNumber, dong.id);

            // Edit the inline message
            await this.editInlineMessage(
                inlineResult.inline_message_id,
                dongText,
                { reply_markup: dongMarkup }
            );

            return { success: true };

        } catch (error) {
            console.error('Error creating dong:', error);
            return { success: false };
        }
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

export default InlineResultHandler; 