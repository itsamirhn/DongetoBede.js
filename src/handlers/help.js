import BaseHandler from './base.js';

class HelpHandler extends BaseHandler {
    async handle(update) {
        const chatId = update.message.chat.id;

        const helpText = `
برای ثبت خرج در هر گروهی، به گروه خود بروید و دستور زیر را تایپ کنید:
 
<code>@dongetobedebot {مبلغ}</code>

و سپس تعداد نفرات را انتخاب کنید.

اگر میخواهید شماره کارت شما در پیام دونگ نوشته شود، از دستور /setcard استفاده کنید.
`;

        const markup = {
            inline_keyboard: [
                [
                    {
                        text: 'مثال',
                        switch_inline_query: ''
                    }
                ]
            ]
        };

        await this.sendMessage(chatId, helpText, {
            parse_mode: 'HTML',
            reply_markup: markup
        });

        return { success: true };
    }
}

export default HelpHandler; 