import BaseHandler from './base.js';

class StartHandler extends BaseHandler {
    async handle(update) {
        const user = await this.getOrCreateUser(update);
        const chatId = update.message.chat.id;
        const messageId = update.message.message_id;

        // Check if there's data for setcard
        const text = update.message.text;
        if (text && text.includes('setcard')) {
            // Forward to setcard handler
            const setCardHandler = new (await import('./setcard.js')).default(this.db);
            setCardHandler.setBotToken(this.botToken);
            return await setCardHandler.handleDeepLink(update, user);
        }

        const welcomeText = `به بات دونگ خوش آمدید!

برای راهنمایی کار با بات، از دستور /help استفاده کنید.`;

        await this.sendMessage(chatId, welcomeText, { reply_to_message_id: messageId });

        return { success: true };
    }
}

export default StartHandler; 