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
 
<code>@${botUsername} {مبلغ}</code>

و سپس تعداد نفرات را انتخاب کنید.

اگر میخواهید شماره کارت شما در پیام دونگ نوشته شود، از دستور /setcard استفاده کنید.
`,

    SET_CARD_PROMPT: `برای ست شدن پیش‌فرض شماره کارت، لطفا شماره کارت خود را ارسال کنید.`,

    CANCEL: `عملیات لغو شد.`,

    DEFAULT_TEXT: `برای راهنمایی کار با بات، از دستور /help استفاده کنید.`,

    CARD_INVALID: `شماره کارت نامعتبر است. لطفا شماره کارت را به درستی وارد کنید.`,

    CARD_SUCCESS: `شماره کارت شما با موفقیت ثبت شد.`,

    INVALID_EXPRESSION: ` مبلغ نامعتبر است. لطفا مبلغ را به صورت  عددی یا یک عبارت ریاضی غیر اعشاری وارد کنید.`
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
    INVALID_DESCRIPTION: 'مجموع هزینه را به تومان وارد کنید.',
    UNLIMITED_TITLE: 'دنگ نامحدود',
    LIMITED_TITLE_SUFFIX: 'نفره',
    DONG_PREFIX: 'دنگ',
    PER_PERSON_PREFIX: 'نفری'
};

// Button Text
export const BUTTONS = {
    EXAMPLE: 'مثال',
    PAYMENT_BUTTON: 'دنگمو دادم'
};

// Regex Patterns
export const PATTERNS = {
    CARD_NUMBER: /^[2569]\d{15}$/,
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