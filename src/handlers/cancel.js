import BaseHandler from './base.js';

class CancelHandler extends BaseHandler {
    async handle(update) {
        const user = await this.getOrCreateUser(update);
        const chatId = update.message.chat.id;

        // Reset user state
        user.state = '';
        await this.db.updateUser(user);

        const text = `عملیات لغو شد.`;

        await this.sendMessage(chatId, text);

        return { success: true };
    }
}

export default CancelHandler; 