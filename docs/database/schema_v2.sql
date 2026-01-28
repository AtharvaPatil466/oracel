-- Phase 5: Database Schema Design (SQLite/PostgreSQL Compatible)

-- 1. Stream Scans (TimeSeries Data)
-- High volume, append-only table for historical trending
CREATE TABLE stream_scans (
    id SERIAL PRIMARY KEY,
    stream_id VARCHAR(50) NOT NULL, -- 'climate', 'economic', etc.
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metrics_json JSONB NOT NULL,    -- Flexible storage for stream-specific data
    status VARCHAR(20) NOT NULL,    -- 'healthy', 'error'
    scan_duration_ms INTEGER
);

CREATE INDEX idx_scans_stream_time ON stream_scans(stream_id, timestamp DESC);

-- 2. Alerts (The Intelligence Memory)
-- Tracking system anomalies
CREATE TABLE alerts (
    id UUID PRIMARY KEY,
    stream_ids TEXT[],              -- Affected streams (Array)
    type VARCHAR(50) NOT NULL,      -- 'single', 'correlation', 'compound'
    severity VARCHAR(20) NOT NULL,  -- 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'
    message TEXT NOT NULL,
    probability FLOAT,              -- 0.0 to 1.0 confidence
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_type VARCHAR(50)     -- 'dismissed', 'acted_on', 'auto_expired'
);

CREATE INDEX idx_alerts_active ON alerts(created_at) WHERE resolved_at IS NULL;

-- 3. Scenarios (The Future Predictions)
CREATE TABLE scenarios (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    probability FLOAT,
    impact_estimate JSONB,
    trigger_streams TEXT[],
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- 4. Correlations (The Learned Patterns)
CREATE TABLE correlations (
    id SERIAL PRIMARY KEY,
    pattern_signature VARCHAR(255), -- Hash of the pattern logic
    description TEXT,
    occurrences INTEGER DEFAULT 1,
    avg_lead_time_days INTEGER,
    last_detected TIMESTAMP
);
