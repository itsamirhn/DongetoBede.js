// Persian digits mapping
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Convert English digits to Persian digits
function toPersianDigits(str) {
    if (typeof str !== 'string') {
        str = str.toString();
    }

    return str.replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
}

// Convert Persian digits to English digits
function toEnglishDigits(str) {
    if (typeof str !== 'string') {
        str = str.toString();
    }

    return str.replace(/[۰-۹]/g, (digit) => {
        const index = persianDigits.indexOf(digit);
        return index !== -1 ? englishDigits[index] : digit;
    });
}

// Convert number to Persian digits
function toPersianDigitsFromInt(num) {
    return toPersianDigits(num.toString());
}

// Format number with thousand separators in Persian
function formatNumberPersian(num) {
    const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return toPersianDigits(formatted);
}

// Format amount as Toman (divide by 10 and add thousand separators)
function formatTomanPersian(amount) {
    const toman = Math.floor(amount / 10);
    return formatNumberPersian(toman) + ' تومان';
}

export {
    toPersianDigits,
    toEnglishDigits,
    toPersianDigitsFromInt,
    formatNumberPersian,
    formatTomanPersian
}; 