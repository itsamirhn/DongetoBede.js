// Telegram API Constants
export const API = {
    BASE_URL: 'https://api.telegram.org/bot',
    ENDPOINTS: {
        SEND_MESSAGE: 'sendMessage',
        EDIT_MESSAGE: 'editMessageText',
        ANSWER_INLINE_QUERY: 'answerInlineQuery',
        ANSWER_CALLBACK_QUERY: 'answerCallbackQuery'
    },
    PARSE_MODE: {
        MARKDOWN: 'Markdown',
        HTML: 'HTML'
    },
    CONTENT_TYPE: 'application/json'
};

// Bot Messages
export const MESSAGES = {
    WELCOME: `به بات دونگ خوش آمدید!

برای راهنمایی کار با بات، از دستور /help استفاده کنید.`,

    HELP: (botUsername) => `
برای ثبت خرج در هر گروهی، به گروه خود بروید و دستور زیر را تایپ کنید:
 
<code>@${botUsername} {مبلغ و شماره کارت}</code>

متن ورودی شما به کمک هوش مصنوعی پردازش شده و مبلغ و شماره کارتتان به طور خودکار استخراج می‌شود.

سپس از بین موارد موجود، تعداد نفرات را انتخاب کنید.

اگر میخواهید شماره کارت ثابت شما در پیام دونگ نوشته شود، از دستور /setcard استفاده کنید.
`,

    SET_CARD_PROMPT: `برای ست شدن پیش‌فرض شماره کارت، لطفا شماره کارت خود را ارسال کنید.`,

    CANCEL: `عملیات لغو شد.`,

    DEFAULT_TEXT: `برای راهنمایی کار با بات، از دستور /help استفاده کنید.`,

    CARD_INVALID: `شماره کارت نامعتبر است. لطفا شماره کارت را به درستی وارد کنید.`,

    CARD_SUCCESS: `شماره کارت شما با موفقیت ثبت شد.`,

    INVALID_EXPRESSION: ` مبلغ نامعتبر است. لطفا مبلغ و یا شماره کارت را به صورت عددی غیر اعشاری وارد کنید.`
};

// Callback Messages
export const CALLBACK_MESSAGES = {
    INVALID_OPERATION: 'عملیات نامعتبر',
    PAYMENT_RECORDED: 'دونگ شما ثبت شد!',
    PAYMENT_REMOVED: 'دونگ شما پس گرفته شد!',
    PAYMENT_ERROR: 'خطا در ثبت پرداخت'
};

// Inline Article Content
export const INLINE_CONTENT = {
    INVALID_TITLE: 'مبلغ نامعتبر',
    INVALID_DESCRIPTION: 'مجموع هزینه را وارد کنید.',
    UNLIMITED_TITLE: 'دنگ نامحدود',
    LIMITED_TITLE: (totalPeople) => `دنگ ${totalPeople} نفره`,
    VALID_DESCRIPTION: (perPerson, cardNumber) => {
        if (cardNumber) {
            return `نفری ${perPerson} به کارت ${cardNumber}`
        }
        return `نفری ${perPerson}`
    },
};

// Button Text
export const BUTTONS = {
    EXAMPLE: 'مثال',
    PAYMENT_BUTTON: 'دنگمو دادم'
};

// Regex Patterns
export const PATTERNS = {
    CARD_NUMBER: /^[2569]\d{15}$/,
    CARD_NUMBER_IN_TEXT: /[2569]\d{15}/,
    DEEP_LINK_SETCARD: /start setcard/,
    CALLBACK_PAYDONG: /paydong\|(.+)/
};

// Configuration
export const CONFIG = {
    MAX_PEOPLE: 15,
    MIN_PEOPLE: 2,
    DEFAULT_STATE: '',
    SETCARD_STATE: 'setcard',
    EXAMPLE_EXPRESSION: '56000 + 12000',
    INVALID_ARTICLE_ID: 'invalid',
    CALLBACK_PREFIX: 'paydong'
};

// Error Messages
export const ERRORS = {
    TELEGRAM_API: 'Telegram API error',
    NO_USER_FOUND: 'No user found in update',
    USER_NOT_FOUND: 'User not found',
    INVALID_EXPRESSION: 'Invalid expression',
    INVALID_AMOUNT: 'Invalid amount'
};

// AI Configuration
export const AI = {
    MODEL: '@cf/meta/llama-3-8b-instruct',
    SYSTEM_PROMPT: 'You are a helpful assistant that extracts financial information from Persian/English text. Extract the total_amount (as a number) and card_number (16 digits) from the given text. Return only a JSON object with these fields: {"total_amount": number, "card_number": "string"}. If no card number is found, return null for card_number. If no amount is found, return null for total_amount. DO NOT RETURN ANYTHING ELSE THAN THE JSON OBJECT.'
}; 