import BaseHandler from './base.js';

class SetCardHandler extends BaseHandler {
    async handle(update) {
        const user = await this.getOrCreateUser(update);
        const chatId = update.message.chat.id;
        const messageId = update.message.message_id;

        await this.setUserState(user, 'setcard');

        const text = `برای ست شدن پیش‌فرض شماره کارت، لطفا شماره کارت خود را ارسال کنید.`;

        await this.sendMessage(chatId, text, { reply_to_message_id: messageId });

        return { success: true };
    }

    async handleDeepLink(update, user) {
        const chatId = update.message.chat.id;
        const messageId = update.message.message_id;
        const text = update.message.text;

        // Extract data from deep link
        const match = text.match(/start setcard/);
        if (match) {
            await this.setUserState(user, 'setcard');

            const text = `برای ست شدن پیش‌فرض شماره کارت، لطفا شماره کارت خود را ارسال کنید.`;

            await this.sendMessage(chatId, text, { reply_to_message_id: messageId });
        }

        return { success: true };
    }

    async setUserState(user, state) {
        user.state = state;
        await this.db.updateUser(user);
    }
}

export default SetCardHandler; 