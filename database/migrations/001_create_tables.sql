-- Security Audit Tracker Database Schema
-- DevOps Exam 2025
--
-- This schema creates the necessary tables for the Security Audit Tracker application
-- Students do NOT need to modify this - they just need to run it in their containerized database

-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
    id SERIAL PRIMARY KEY,
    system_name VARCHAR(255) NOT NULL,
    audit_type VARCHAR(50) NOT NULL CHECK (audit_type IN (
        'penetration_test',
        'vulnerability_scan',
        'compliance_check',
        'code_review',
        'access_review'
    )),
    auditor VARCHAR(255) NOT NULL,
    audit_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress' CHECK (status IN (
        'pending',
        'in_progress',
        'completed'
    )),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create findings table
CREATE TABLE IF NOT EXISTS findings (
    id SERIAL PRIMARY KEY,
    audit_id INTEGER NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN (
        'critical',
        'high',
        'medium',
        'low'
    )),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN (
        'open',
        'in_progress',
        'resolved',
        'false_positive'
    )),
    discovered_date TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audits_date ON audits(audit_date DESC);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_findings_audit_id ON findings(audit_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity);
CREATE INDEX IF NOT EXISTS idx_findings_status ON findings(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON audits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON findings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial comment for documentation
COMMENT ON TABLE audits IS 'Stores security audit records for various systems';
COMMENT ON TABLE findings IS 'Stores security findings discovered during audits';
