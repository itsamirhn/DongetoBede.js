import BaseHandler from './base.js';
import ExpressionEvaluator from '../utils/expression.js';
import { toEnglishDigits, toPersianDigitsFromInt } from '../utils/persian.js';
import { getDongPerPersonToman } from '../utils/formatting.js';

class InlineHandler extends BaseHandler {
    constructor(db) {
        super(db);
        this.evaluator = new ExpressionEvaluator();
    }

    async handle(update) {
        const user = await this.getOrCreateUser(update);
        const query = update.inline_query.query;
        const inlineQueryId = update.inline_query.id;

        // Convert Persian digits to English for expression evaluation
        const expressionStr = toEnglishDigits(query);

        try {
            const amountFloat = this.evaluator.eval(expressionStr);
            const amount = Math.round(amountFloat);

            if (amount <= 0) {
                throw new Error('Invalid amount');
            }

            const results = this.getValidArticles(amount, user.cardNumber);

            await this.answerInlineQuery(inlineQueryId, results);

        } catch (error) {
            const results = [this.getInvalidArticle()];
            await this.answerInlineQuery(inlineQueryId, results);
        }

        return { success: true };
    }

    getValidLimitedArticle(amount, totalPeople, cardNumber) {
        const perPersonStr = getDongPerPersonToman(amount, totalPeople);
        const totalPeopleStr = toPersianDigitsFromInt(totalPeople);
        const txt = this.getDongText(amount, totalPeople, cardNumber, []);

        return {
            type: 'article',
            id: `${amount}-${totalPeople}`,
            title: `دنگ ${totalPeopleStr} نفره`,
            description: `نفری ${perPersonStr}`,
            input_message_content: {
                message_text: txt,
                parse_mode: 'Markdown'
            },
            reply_markup: this.getDongMarkup(0, totalPeople, cardNumber, null)
        };
    }

    getValidUnlimitedArticle(amount, cardNumber) {
        const perPersonStr = getDongPerPersonToman(amount, 0);
        const txt = this.getDongText(amount, 0, cardNumber, []);

        return {
            type: 'article',
            id: `${amount}-0`,
            title: 'دنگ نامحدود',
            description: `نفری ${perPersonStr}`,
            input_message_content: {
                message_text: txt,
                parse_mode: 'Markdown'
            },
            reply_markup: this.getDongMarkup(0, 0, cardNumber, null)
        };
    }

    getInvalidArticle() {
        return {
            type: 'article',
            id: 'invalid',
            title: 'مبلغ نامعتبر',
            description: 'مجموع هزینه را به تومان وارد کنید.',
            input_message_content: {
                message_text: ' مبلغ نامعتبر است. لطفا مبلغ را به صورت  عددی یا یک عبارت ریاضی غیر اعشاری وارد کنید.',
                parse_mode: 'Markdown'
            },
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'مثال',
                            switch_inline_query_current_chat: '56000 + 12000'
                        }
                    ]
                ]
            }
        };
    }

    getValidArticles(amount, cardNumber) {
        const results = [];

        // Add unlimited option first
        results.push(this.getValidUnlimitedArticle(amount, cardNumber));

        // Add limited options (2-15 people)
        for (let i = 2; i <= 15; i++) {
            results.push(this.getValidLimitedArticle(amount, i, cardNumber));
        }

        return results;
    }

    // Helper methods (similar to formatting utils but for inline results)
    getDongText(amount, totalPeople, cardNumber, paidUsers) {
        const perPersonStr = getDongPerPersonToman(amount, totalPeople);
        let text = `نفری ${perPersonStr}`;

        if (cardNumber) {
            text += `\nشماره کارت: \`${cardNumber}\``;
        }

        if (paidUsers && paidUsers.length > 0) {
            text += `\n\nکسایی که دنگشونو دادن:`;
            for (const user of paidUsers) {
                let identifier = `${user.firstName} ${user.lastName || ''}`.trim();
                if (user.username) {
                    identifier = `@${user.username}`;
                }
                text += `\n[${identifier}](tg://user?id=${user.id})`;
            }
        }

        return text;
    }

    getDongMarkup(paidUsersCount, totalPeople, cardNumber, dongId) {
        let buttonText;
        if (totalPeople > 0) {
            buttonText = `دنگمو دادم (${toPersianDigitsFromInt(paidUsersCount)}/${toPersianDigitsFromInt(totalPeople)})`;
        } else {
            buttonText = `دنگمو دادم (${toPersianDigitsFromInt(paidUsersCount)})`;
        }

        return {
            inline_keyboard: [
                [
                    {
                        text: buttonText,
                        callback_data: dongId ? `paydong|${dongId}` : 'paydong'
                    }
                ]
            ]
        };
    }
}

export default InlineHandler; 