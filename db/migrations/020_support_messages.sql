-- Migration 020: Create support messages table

CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL,
    text TEXT,
    attachment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_support_messages_conversation_id ON support_messages(conversation_id);

ALTER TABLE support_requests ADD COLUMN IF NOT EXISTS conversation_id UUID;
