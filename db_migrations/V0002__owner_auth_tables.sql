
CREATE TABLE t_p99711697_auction_app_developm.owner_users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    admin_registration_email VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p99711697_auction_app_developm.owner_sessions (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES t_p99711697_auction_app_developm.owner_users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE t_p99711697_auction_app_developm.otp_codes (
    id SERIAL PRIMARY KEY,
    target_email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    extra_data JSONB NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '10 minutes'),
    created_at TIMESTAMP DEFAULT NOW()
);
