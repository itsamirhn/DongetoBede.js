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

// Bot Messages (HTML parse mode unless noted)
export const MESSAGES = {
    WELCOME: (botUsername) => `👋 به ربات <b>دُنگمو بده</b> خوش آمدید!

هزینه‌های مشترک رو در چند ثانیه بین دوستات تقسیم کن. کافیه توی هر چت یا گروهی اسم ربات رو بنویسی و خرجت رو بگی تا ربات خودش سهم هر نفر رو حساب کنه.

<b>چند نمونه که می‌تونی همین حالا امتحان کنی</b>
• <code>@${botUsername} 56000 + 12000 + 8000</code>
• <code>@${botUsername} ناهار ۸۵ هزار، تاکسی ۳۰ هزار و کافه ۴۵ هزار</code>
• <code>@${botUsername} شام ۱۲۰ هزار تومان به کارت 6037991234567890</code>

💳 اگه دوست داری شماره کارتت همیشه توی پیام دنگ بیاد، یک‌بار با /setcard ثبتش کن.

برای راهنمای کامل دستور /help رو بفرست.`,

    HELP: (botUsername) => `📘 <b>راهنمای ربات دُنگمو بده</b>

برای تقسیم یک هزینه کافیه توی هر گروه یا چت اسم ربات رو بنویسی و خرجت رو بگی، بعد از بین گزینه‌ها تعداد نفرات رو انتخاب کنی تا سهم هر نفر حساب بشه. هر کس هم با دکمه‌ی «دنگمو دادم» پرداختش رو ثبت می‌کنه.

<b>چه چیزهایی می‌تونی بنویسی؟</b>
• یک مبلغ ساده مثل <code>@${botUsername} 120000</code>
• جمع چند خرج مثل <code>@${botUsername} 56000 + 12000</code>
• با زبان خودت مثل <code>@${botUsername} ناهار ۸۵ هزار، تاکسی ۳۰ هزار</code>
• همراه شماره کارت مثل <code>@${botUsername} دنگ سفر ۲۵۰ هزار به کارت 6037991234567890</code>

💳 با دستور /setcard شماره کارتت رو ذخیره کن تا خودکار توی پیام دنگ بیاد.`,

    SET_CARD_PROMPT: `لطفاً شماره کارت ۱۶ رقمی‌ات رو بفرست تا به‌صورت پیش‌فرض توی پیام‌های دنگ بیاد. مثلاً <code>6037991234567890</code>

برای انصراف دستور /cancel رو بفرست.`,

    CANCEL: `عملیات لغو شد.`,

    DEFAULT_TEXT: (botUsername) => `برای تقسیم هزینه توی یک گروه اسم ربات رو بنویس و خرجت رو بگو، مثلاً <code>@${botUsername} 56000 + 12000</code>

برای راهنمای کامل دستور /help رو بفرست.`,

    CARD_INVALID: `شماره کارت معتبر نیست. باید ۱۶ رقم باشه و با ۲، ۵، ۶ یا ۹ شروع بشه. مثلاً <code>6037991234567890</code>`,

    CARD_SUCCESS: `✅ شماره کارتت ذخیره شد و از این به بعد خودکار توی پیام‌های دنگ میاد.`,

    INVALID_EXPRESSION: `🤔 نتونستم مبلغ رو تشخیص بدم. یکی از این نمونه‌ها رو امتحان کن.
• <code>56000 + 12000</code>
• <code>شام ۵۶ هزار، نوشیدنی ۱۲ هزار تومان</code>
• <code>ناهار ۸۰ هزار به کارت 6037991234567890</code>`
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
    INVALID_TITLE: '✏️ مبلغ را بنویسید',
    INVALID_DESCRIPTION: 'مثلاً «۵۶ هزار + ۱۲ هزار» یا «ناهار ۸۵ هزار، تاکسی ۳۰ هزار»',
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
    // A card number embedded in text: 16 digits, contiguous or in 4-4-4-4 groups
    // separated by spaces/dashes. Boundaries prevent grabbing part of a longer number.
    CARD_IN_TEXT: /(?<!\d)[2569]\d{3}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}(?!\d)/,
    // Currency words that are noise around a numeric amount (stripped before parsing).
    CURRENCY_FILLER: /تومان|تومن|تومه|ريال|ریال|toman|rial/gi,
    // A query that is only digits, whitespace and "+", parseable without AI.
    PLAIN_AMOUNT: /^[\d\s+]+$/,
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
    MODEL: '@cf/meta/llama-4-scout-17b-16e-instruct',
    SYSTEM_PROMPT: `You extract two fields from short Persian or English text describing a shared expense ("dong").

Rules for total_amount:
- The text may contain ONE or MORE money amounts. Sum ALL of them into a single total.
- Amounts may be digits ("56000"), or Persian/English words ("پنجاه و شش هزار", "fifty six thousand").
- Apply multipliers: هزار / "k" = ×1000, میلیون / "m" = ×1,000,000, تومان/تومن/toman is the currency unit (do not multiply).
- "۵۶ هزار تومان" = 56000. "دو میلیون و پانصد هزار" = 2500000. "25 هزار + 35 هزار" = 60000.
- Return total_amount as an integer number of Toman. If no amount is present, return 0.

Rules for card_number:
- A 16-digit Iranian bank card number (starts with 2, 5, 6, or 9). Strip spaces/dashes.
- If no valid 16-digit card number is present, return an empty string "".

Return ONLY the structured object. Do not explain.`,
    // JSON-schema for Workers AI structured outputs, guarantees schema-valid JSON.
    SCHEMA: {
        type: 'object',
        properties: {
            total_amount: { type: 'number', description: 'Total amount in Toman, sum of all amounts. 0 if none.' },
            card_number: { type: 'string', description: '16-digit card number, or "" if none.' }
        },
        required: ['total_amount', 'card_number']
    }
}; 