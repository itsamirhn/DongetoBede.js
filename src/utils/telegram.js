import { API, ERRORS } from '../constants.js';

let botToken = null;

function setBotToken(token) {
    botToken = token;
}

async function sendMessage(chatId, text, options = {}) {
    const url = `${API.BASE_URL}${botToken}/${API.ENDPOINTS.SEND_MESSAGE}`;

    const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: options.parse_mode || API.PARSE_MODE.MARKDOWN,
        ...options
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': API.CONTENT_TYPE },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`${ERRORS.TELEGRAM_API}: ${response.status}`);
    }

    return response.json();
}

async function editMessage(chatId, messageId, text, options = {}) {
    const url = `${API.BASE_URL}${botToken}/${API.ENDPOINTS.EDIT_MESSAGE}`;

    const payload = {
        chat_id: chatId,
        message_id: messageId,
        text: text,
        parse_mode: options.parse_mode || API.PARSE_MODE.MARKDOWN,
        ...options
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': API.CONTENT_TYPE },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`${ERRORS.TELEGRAM_API}: ${response.status}`);
    }

    return response.json();
}

async function editInlineMessage(inlineMessageId, text, options = {}) {
    const url = `${API.BASE_URL}${botToken}/${API.ENDPOINTS.EDIT_MESSAGE}`;

    const payload = {
        inline_message_id: inlineMessageId,
        text: text,
        parse_mode: options.parse_mode || API.PARSE_MODE.MARKDOWN,
        ...options
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': API.CONTENT_TYPE },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`${ERRORS.TELEGRAM_API}: ${response.status}`);
    }

    return response.json();
}

async function answerInlineQuery(inlineQueryId, results, options = {}) {
    const url = `${API.BASE_URL}${botToken}/${API.ENDPOINTS.ANSWER_INLINE_QUERY}`;

    const payload = {
        inline_query_id: inlineQueryId,
        results: results,
        ...options
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': API.CONTENT_TYPE },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`${ERRORS.TELEGRAM_API}: ${response.status}`);
    }

    return response.json();
}

async function answerCallbackQuery(callbackQueryId, options = {}) {
    const url = `${API.BASE_URL}${botToken}/${API.ENDPOINTS.ANSWER_CALLBACK_QUERY}`;

    const payload = {
        callback_query_id: callbackQueryId,
        ...options
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': API.CONTENT_TYPE },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`${ERRORS.TELEGRAM_API}: ${response.status}`);
    }

    return response.json();
}

export {
    setBotToken,
    sendMessage,
    editMessage,
    editInlineMessage,
    answerInlineQuery,
    answerCallbackQuery
}; 