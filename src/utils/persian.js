const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function toPersianDigits(str) {
    if (typeof str !== 'string') {
        str = str.toString();
    }

    return str.replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
}

function toEnglishDigits(str) {
    if (typeof str !== 'string') {
        str = str.toString();
    }

    return str.replace(/[۰-۹]/g, (digit) => {
        const index = persianDigits.indexOf(digit);
        return index !== -1 ? englishDigits[index] : digit;
    });
}

function toPersianDigitsFromInt(num) {
    return toPersianDigits(num.toString());
}


export {
    toPersianDigits,
    toEnglishDigits,
    toPersianDigitsFromInt,
};