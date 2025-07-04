import { toPersianDigitsFromInt, toPersianDigits } from './persian.js';

// Generate per-person cost string (matching Go implementation)
function getDongPerPersonToman(amount, totalPeople) {
    let priceFloat = amount;
    if (totalPeople > 0) {
        priceFloat = priceFloat / totalPeople;
    }

    let priceStr;
    if (priceFloat === Math.trunc(priceFloat)) {
        priceStr = `${priceFloat.toFixed(0)} تومان`;
    } else {
        priceStr = `${priceFloat.toFixed(1)} تومان`;
    }

    return toPersianDigits(priceStr);
}

// Generate dong message text
function getDongText(amount, totalPeople, cardNumber, paidUsers) {
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

// Generate inline keyboard markup for dong
function getDongMarkup(paidUsersCount, totalPeople, cardNumber, dongId) {
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

export {
    getDongPerPersonToman,
    getDongText,
    getDongMarkup,
};