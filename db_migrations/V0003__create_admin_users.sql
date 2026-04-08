
CREATE TABLE IF NOT EXISTS t_p99711697_auction_app_developm.admin_users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL DEFAULT '',
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
