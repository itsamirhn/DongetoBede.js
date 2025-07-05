import { sendMessage, editMessage, editInlineMessage, answerInlineQuery, answerCallbackQuery } from './utils/telegram.js';
import { getOrCreateUser } from './utils/user.js';
import { toEnglishDigits, toPersianDigitsFromInt } from './utils/persian.js';
import { getDongText, getDongMarkup, getDongPerPersonToman } from './utils/formatting.js';
import evaluateExpression from './utils/expression.js';
import { MESSAGES, CALLBACK_MESSAGES, INLINE_CONTENT, BUTTONS, PATTERNS, CONFIG, ERRORS, API } from './constants.js';

async function handleStart(db, update) {
    const user = await getOrCreateUser(db, update);
    const chatId = update.message.chat.id;
    const messageId = update.message.message_id;
    const text = update.message.text;

    if (text && text.includes('setcard')) {
        return await handleSetCardDeepLink(db, update, user);
    }

    await sendMessage(chatId, MESSAGES.WELCOME, { reply_to_message_id: messageId });
    return { success: true };
}

async function handleSetCard(db, update) {
    const user = await getOrCreateUser(db, update);
    const chatId = update.message.chat.id;
    const messageId = update.message.message_id;

    user.state = CONFIG.SETCARD_STATE;
    await db.updateUser(user);

    await sendMessage(chatId, MESSAGES.SET_CARD_PROMPT, { reply_to_message_id: messageId });
    return { success: true };
}

async function handleSetCardDeepLink(db, update, user) {
    const chatId = update.message.chat.id;
    const messageId = update.message.message_id;
    const text = update.message.text;

    if (text.match(PATTERNS.DEEP_LINK_SETCARD)) {
        user.state = CONFIG.SETCARD_STATE;
        await db.updateUser(user);

        await sendMessage(chatId, MESSAGES.SET_CARD_PROMPT, { reply_to_message_id: messageId });
    }

    return { success: true };
}

async function handleHelp(db, update, botUsername) {
    const chatId = update.message.chat.id;
    const messageId = update.message.message_id;

    const markup = {
        inline_keyboard: [
            [
                {
                    text: BUTTONS.EXAMPLE,
                    switch_inline_query: ''
                }
            ]
        ]
    };

    await sendMessage(chatId, MESSAGES.HELP(botUsername), {
        parse_mode: API.PARSE_MODE.HTML,
        reply_markup: markup,
        reply_to_message_id: messageId
    });

    return { success: true };
}

async function handleCancel(db, update) {
    const user = await getOrCreateUser(db, update);
    const chatId = update.message.chat.id;
    const messageId = update.message.message_id;

    user.state = CONFIG.DEFAULT_STATE;
    await db.updateUser(user);

    await sendMessage(chatId, MESSAGES.CANCEL, { reply_to_message_id: messageId });
    return { success: true };
}

async function handleText(db, update) {
    const user = await getOrCreateUser(db, update);
    const chatId = update.message.chat.id;
    const messageId = update.message.message_id;
    const messageText = update.message.text;

    if (user.state === CONFIG.SETCARD_STATE) {
        return await handleSetCardText(db, chatId, messageText, user, messageId);
    }

    await sendMessage(chatId, MESSAGES.DEFAULT_TEXT, { reply_to_message_id: messageId });
    return { success: true };
}

async function handleSetCardText(db, chatId, messageText, user, messageId) {
    const cardNumber = toEnglishDigits(messageText.trim());

    if (!PATTERNS.CARD_NUMBER.test(cardNumber)) {
        await sendMessage(chatId, MESSAGES.CARD_INVALID, { reply_to_message_id: messageId });
        return { success: false };
    }

    user.cardNumber = cardNumber;
    user.state = CONFIG.DEFAULT_STATE;
    await db.updateUser(user);

    await sendMessage(chatId, MESSAGES.CARD_SUCCESS, { reply_to_message_id: messageId });
    return { success: true };
}

async function handleInline(db, update) {
    const user = await getOrCreateUser(db, update);
    const query = update.inline_query.query;
    const inlineQueryId = update.inline_query.id;

    const expressionStr = toEnglishDigits(query);

    try {
        const amountFloat = evaluateExpression(expressionStr);
        const amount = Math.round(amountFloat);

        if (amount <= 0) {
            throw new Error(ERRORS.INVALID_AMOUNT);
        }

        const results = getValidArticles(amount, user.cardNumber);
        await answerInlineQuery(inlineQueryId, results);
    } catch (error) {
        const results = [getInvalidArticle()];
        await answerInlineQuery(inlineQueryId, results);
    }

    return { success: true };
}

function getValidArticles(amount, cardNumber) {
    const results = [];
    results.push(getValidUnlimitedArticle(amount, cardNumber));

    for (let i = CONFIG.MIN_PEOPLE; i <= CONFIG.MAX_PEOPLE; i++) {
        results.push(getValidLimitedArticle(amount, i, cardNumber));
    }

    return results;
}

function getValidLimitedArticle(amount, totalPeople, cardNumber) {
    const perPersonStr = getDongPerPersonToman(amount, totalPeople);
    const totalPeopleStr = toPersianDigitsFromInt(totalPeople);
    const txt = getDongText(amount, totalPeople, cardNumber, []);

    return {
        type: 'article',
        id: `${amount}-${totalPeople}`,
        title: `${INLINE_CONTENT.DONG_PREFIX} ${totalPeopleStr} ${INLINE_CONTENT.LIMITED_TITLE_SUFFIX}`,
        description: `${INLINE_CONTENT.PER_PERSON_PREFIX} ${perPersonStr}`,
        input_message_content: {
            message_text: txt,
            parse_mode: API.PARSE_MODE.MARKDOWN
        },
        reply_markup: getDongMarkup(0, totalPeople, cardNumber, null)
    };
}

function getValidUnlimitedArticle(amount, cardNumber) {
    const perPersonStr = getDongPerPersonToman(amount, 0);
    const txt = getDongText(amount, 0, cardNumber, []);

    return {
        type: 'article',
        id: `${amount}-0`,
        title: INLINE_CONTENT.UNLIMITED_TITLE,
        description: `${INLINE_CONTENT.PER_PERSON_PREFIX} ${perPersonStr}`,
        input_message_content: {
            message_text: txt,
            parse_mode: API.PARSE_MODE.MARKDOWN
        },
        reply_markup: getDongMarkup(0, 0, cardNumber, null)
    };
}

function getInvalidArticle() {
    return {
        type: 'article',
        id: CONFIG.INVALID_ARTICLE_ID,
        title: INLINE_CONTENT.INVALID_TITLE,
        description: INLINE_CONTENT.INVALID_DESCRIPTION,
        input_message_content: {
            message_text: MESSAGES.INVALID_EXPRESSION,
            parse_mode: API.PARSE_MODE.MARKDOWN
        },
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: BUTTONS.EXAMPLE,
                        switch_inline_query_current_chat: CONFIG.EXAMPLE_EXPRESSION
                    }
                ]
            ]
        }
    };
}

async function handleInlineResult(db, update) {
    const user = await getOrCreateUser(db, update);
    const chosenInlineResult = update.chosen_inline_result;
    const resultId = chosenInlineResult.result_id;

    if (resultId === CONFIG.INVALID_ARTICLE_ID) {
        return { success: true };
    }

    const [amount, totalPeople] = resultId.split('-').map(Number);
    const messageId = chosenInlineResult.inline_message_id;

    const dong = {
        issuerUserId: user.id,
        amount: amount,
        cardNumber: user.cardNumber,
        totalPeople: totalPeople,
        paidUserIds: [],
        messageId: messageId
    };

    const dongId = await db.addDong(dong);

    const newText = getDongText(amount, totalPeople, user.cardNumber, []);
    const newMarkup = getDongMarkup(0, totalPeople, user.cardNumber, dongId);

    await editInlineMessage(messageId, newText, { reply_markup: newMarkup });

    return { success: true };
}

async function handleCallback(db, update) {
    const user = await getOrCreateUser(db, update);
    const callbackQuery = update.callback_query;
    const callbackData = callbackQuery.data;

    if (!callbackData.startsWith(CONFIG.CALLBACK_PREFIX)) {
        await answerCallbackQuery(callbackQuery.id, { text: CALLBACK_MESSAGES.INVALID_OPERATION });
        return { success: false };
    }

    const dongIdMatch = callbackData.match(PATTERNS.CALLBACK_PAYDONG);
    if (!dongIdMatch) {
        await answerCallbackQuery(callbackQuery.id, { text: CALLBACK_MESSAGES.INVALID_OPERATION });
        return { success: false };
    }

    const dongId = dongIdMatch[1];

    try {
        const dong = await db.getDongById(dongId);

        if (dong.paidUserIds.includes(user.id)) {
            dong.paidUserIds = dong.paidUserIds.filter(id => id !== user.id);
            await db.updateDong(dong);
            await answerCallbackQuery(callbackQuery.id, { text: CALLBACK_MESSAGES.PAYMENT_REMOVED });
        } else {
            dong.paidUserIds.push(user.id);
            await db.updateDong(dong);
            await answerCallbackQuery(callbackQuery.id, { text: CALLBACK_MESSAGES.PAYMENT_RECORDED });
        }

        const paidUsers = await db.getUsersByIds(dong.paidUserIds);
        const newText = getDongText(dong.amount, dong.totalPeople, dong.cardNumber, paidUsers);
        const newMarkup = getDongMarkup(dong.paidUserIds.length, dong.totalPeople, dong.cardNumber, dong.id);

        if (callbackQuery.inline_message_id) {
            await editInlineMessage(callbackQuery.inline_message_id, newText, { reply_markup: newMarkup });
        } else {
            await editMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id, newText, { reply_markup: newMarkup });
        }
    } catch (error) {
        console.error('Error handling callback:', error);
        await answerCallbackQuery(callbackQuery.id, { text: CALLBACK_MESSAGES.PAYMENT_ERROR });
    }

    return { success: true };
}

export {
    handleStart,
    handleSetCard,
    handleHelp,
    handleCancel,
    handleText,
    handleInline,
    handleInlineResult,
    handleCallback
}; 