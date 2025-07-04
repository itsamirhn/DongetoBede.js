class DatabaseClient {
    constructor(d1Database) {
        this.db = d1Database;
    }

    async addUser(user) {
        const result = await this.db.prepare(`
      INSERT OR REPLACE INTO users (id, first_name, last_name, username, card_number, state, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
            user.id,
            user.firstName,
            user.lastName || null,
            user.username || null,
            user.cardNumber || null,
            user.state || ''
        ).run();

        return user.id;
    }

    async getUserById(id) {
        const result = await this.db.prepare(`
      SELECT id, first_name, last_name, username, card_number, state, created_at, updated_at
      FROM users WHERE id = ?
    `).bind(id).first();

        if (!result) {
            throw new Error('User not found');
        }

        return {
            id: result.id,
            firstName: result.first_name,
            lastName: result.last_name,
            username: result.username,
            cardNumber: result.card_number,
            state: result.state,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        };
    }

    async getUsersByIds(ids) {
        if (!ids || ids.length === 0) {
            return [];
        }

        const placeholders = ids.map(() => '?').join(',');
        const result = await this.db.prepare(`
      SELECT id, first_name, last_name, username, card_number, state, created_at, updated_at
      FROM users WHERE id IN (${placeholders})
    `).bind(...ids).all();

        return result.results.map(row => ({
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            username: row.username,
            cardNumber: row.card_number,
            state: row.state,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }

    async updateUser(user) {
        const result = await this.db.prepare(`
      UPDATE users 
      SET first_name = ?, last_name = ?, username = ?, card_number = ?, state = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
            user.firstName,
            user.lastName || null,
            user.username || null,
            user.cardNumber || null,
            user.state || '',
            user.id
        ).run();

        if (result.changes === 0) {
            throw new Error('User not found');
        }

        return user;
    }

    async addDong(dong) {
        const result = await this.db.prepare(`
      INSERT INTO dongs (issuer_user_id, amount, card_number, total_people, paid_user_ids, message_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
            dong.issuerUserId,
            dong.amount,
            dong.cardNumber,
            dong.totalPeople,
            JSON.stringify(dong.paidUserIds || []),
            dong.messageId || null
        ).run();

        return result.meta.last_row_id;
    }

    async getDongById(id) {
        const result = await this.db.prepare(`
      SELECT id, issuer_user_id, amount, card_number, total_people, paid_user_ids, message_id, created_at, updated_at
      FROM dongs WHERE id = ?
    `).bind(id).first();

        if (!result) {
            throw new Error('Dong not found');
        }

        return {
            id: result.id,
            issuerUserId: result.issuer_user_id,
            amount: result.amount,
            cardNumber: result.card_number,
            totalPeople: result.total_people,
            paidUserIds: JSON.parse(result.paid_user_ids),
            messageId: result.message_id,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        };
    }

    async updateDong(dong) {
        const result = await this.db.prepare(`
      UPDATE dongs 
      SET issuer_user_id = ?, amount = ?, card_number = ?, total_people = ?, paid_user_ids = ?, message_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
            dong.issuerUserId,
            dong.amount,
            dong.cardNumber,
            dong.totalPeople,
            JSON.stringify(dong.paidUserIds || []),
            dong.messageId || null,
            dong.id
        ).run();

        if (result.changes === 0) {
            throw new Error('Dong not found');
        }

        return dong;
    }

    async getDongByMessageId(messageId) {
        const result = await this.db.prepare(`
      SELECT id, issuer_user_id, amount, card_number, total_people, paid_user_ids, message_id, created_at, updated_at
      FROM dongs WHERE message_id = ?
    `).bind(messageId).first();

        if (!result) {
            throw new Error('Dong not found');
        }

        return {
            id: result.id,
            issuerUserId: result.issuer_user_id,
            amount: result.amount,
            cardNumber: result.card_number,
            totalPeople: result.total_people,
            paidUserIds: JSON.parse(result.paid_user_ids),
            messageId: result.message_id,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        };
    }
}

export default DatabaseClient; 