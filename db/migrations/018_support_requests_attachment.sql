-- Migration 018: Add attachment to support requests

ALTER TABLE support_requests ADD COLUMN attachment TEXT;
