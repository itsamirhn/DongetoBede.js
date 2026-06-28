const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']; // U+06F0–U+06F9
const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];   // U+0660–U+0669
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

    // Convert both Persian and Arabic-Indic digits to English.
    return str.replace(/[۰-۹٠-٩]/g, (digit) => {
        const persianIndex = persianDigits.indexOf(digit);
        if (persianIndex !== -1) {
            return englishDigits[persianIndex];
        }
        const arabicIndex = arabicDigits.indexOf(digit);
        return arabicIndex !== -1 ? englishDigits[arabicIndex] : digit;
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