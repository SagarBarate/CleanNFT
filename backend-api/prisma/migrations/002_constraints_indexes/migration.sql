-- CreateConstraintsAndIndexes
-- Add additional constraints and indexes for performance and data integrity

-- Add idempotency unique index for waste events
-- This prevents duplicate waste events from the same device at the same time with the same nonce
CREATE UNIQUE INDEX IF NOT EXISTS ux_waste_events_idem
ON waste_events (device_id, occurred_at, COALESCE((raw_payload->>'nonce'), ''))
WHERE device_id IS NOT NULL;

-- Add GIN index on JSON columns for better query performance
CREATE INDEX IF NOT EXISTS idx_waste_events_raw_payload_gin 
ON waste_events USING GIN (raw_payload);

CREATE INDEX IF NOT EXISTS idx_devices_metadata_gin 
ON devices USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_recycling_stations_metadata_gin 
ON recycling_stations USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_nft_definitions_attributes_gin 
ON nft_definitions USING GIN (attributes);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_users_email_lower 
ON users (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_wallets_address_lower 
ON wallets (LOWER(address));

-- Add index for outbox event processing
CREATE INDEX IF NOT EXISTS idx_outbox_events_unprocessed 
ON outbox_events (event_type, created_at) 
WHERE processed_at IS NULL;

-- Add index for blockchain transaction status tracking
CREATE INDEX IF NOT EXISTS idx_blockchain_txs_status 
ON blockchain_txs (status, network);

-- Add index for NFT mint availability queries
CREATE INDEX IF NOT EXISTS idx_nft_mints_available 
ON nft_mints (nft_def_code, status, owner_wallet_id) 
WHERE status = 'MINTED';
