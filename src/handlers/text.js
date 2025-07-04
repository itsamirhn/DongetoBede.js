import BaseHandler from './base.js';
import { toEnglishDigits } from '../utils/persian.js';

class TextHandler extends BaseHandler {
    async handle(update) {
        const user = await this.getOrCreateUser(update);
        const chatId = update.message.chat.id;
        const messageId = update.message.message_id;
        const messageText = update.message.text;

        // Handle based on user state
        if (user.state === 'setcard') {
            return await this.handleSetCard(chatId, messageText, user, messageId);
        }

        // Default response for unrecognized text
        const text = `برای راهنمایی کار با بات، از دستور /help استفاده کنید.`;
        await this.sendMessage(chatId, text, { reply_to_message_id: messageId });

        return { success: true };
    }

    async handleSetCard(chatId, messageText, user, messageId) {
        // Convert Persian digits to English
        const cardNumber = toEnglishDigits(messageText.trim());

        // Validation for Iranian card numbers (16 digits starting with 2, 5, 6, 9)
        if (!/^[2569]\d{15}$/.test(cardNumber)) {
            const text = `شماره کارت نامعتبر است. لطفا شماره کارت را به درستی وارد کنید.`;
            await this.sendMessage(chatId, text, { reply_to_message_id: messageId });
            return { success: false };
        }

        // Update user card number
        user.cardNumber = cardNumber;
        user.state = ''; // Clear state
        await this.db.updateUser(user);

        const text = `شماره کارت شما با موفقیت ثبت شد.`;

        await this.sendMessage(chatId, text, { reply_to_message_id: messageId });

        return { success: true };
    }
}

export default TextHandler; 