-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    username TEXT,
    card_number TEXT,
    state TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dongs table
CREATE TABLE IF NOT EXISTS dongs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issuer_user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    card_number TEXT,
    total_people INTEGER NOT NULL,
    paid_user_ids TEXT DEFAULT '[]', -- JSON array of user IDs
    message_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issuer_user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_dongs_issuer ON dongs(issuer_user_id);
CREATE INDEX IF NOT EXISTS idx_dongs_message_id ON dongs(message_id); 