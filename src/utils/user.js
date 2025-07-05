import { ERRORS, CONFIG } from '../constants.js';

function extractUserFromUpdate(update) {
    if (update.message && update.message.from) {
        return update.message.from;
    }
    if (update.callback_query && update.callback_query.from) {
        return update.callback_query.from;
    }
    if (update.inline_query && update.inline_query.from) {
        return update.inline_query.from;
    }
    if (update.chosen_inline_result && update.chosen_inline_result.from) {
        return update.chosen_inline_result.from;
    }
    return null;
}

async function getOrCreateUser(db, update) {
    const user = extractUserFromUpdate(update);
    if (!user) {
        throw new Error(ERRORS.NO_USER_FOUND);
    }

    try {
        return await db.getUserById(user.id);
    } catch (error) {
        const newUser = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            cardNumber: null,
            state: CONFIG.DEFAULT_STATE
        };
        await db.addUser(newUser);
        return newUser;
    }
}

export {
    extractUserFromUpdate,
    getOrCreateUser
}; 