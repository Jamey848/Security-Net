-- Seed Data for Security Audit Tracker
-- DevOps Exam 2025
--
-- This file populates the database with sample data so students can see the application working
-- Students should run this after creating the tables

-- Clear existing data (for re-seeding)
TRUNCATE TABLE findings, audits RESTART IDENTITY CASCADE;

-- Insert sample audits
INSERT INTO audits (system_name, audit_type, auditor, audit_date, status) VALUES
    ('Production API Gateway', 'penetration_test', 'Alice Johnson', NOW() - INTERVAL '2 days', 'completed'),
    ('Customer Database', 'vulnerability_scan', 'Bob Smith', NOW() - INTERVAL '5 days', 'completed'),
    ('Payment Processing System', 'compliance_check', 'Carol Williams', NOW() - INTERVAL '1 day', 'in_progress'),
    ('Mobile App Backend', 'code_review', 'David Brown', NOW() - INTERVAL '10 days', 'completed'),
    ('Admin Portal', 'access_review', 'Eve Davis', NOW() - INTERVAL '3 days', 'in_progress'),
    ('Data Warehouse', 'vulnerability_scan', 'Frank Miller', NOW() - INTERVAL '7 days', 'completed'),
    ('Authentication Service', 'penetration_test', 'Grace Lee', NOW() - INTERVAL '1 day', 'in_progress'),
    ('File Storage System', 'compliance_check', 'Henry Wilson', NOW() - INTERVAL '14 days', 'completed');

-- Insert sample findings for audit 1 (Production API Gateway)
INSERT INTO findings (audit_id, title, description, severity, status, discovered_date) VALUES
    (1, 'SQL Injection Vulnerability in Search Endpoint', 'The /api/search endpoint does not properly sanitize user input, allowing SQL injection attacks. User-controlled parameters are directly concatenated into SQL queries.', 'critical', 'resolved', NOW() - INTERVAL '2 days'),
    (1, 'Missing Rate Limiting', 'API endpoints do not implement rate limiting, making the system vulnerable to denial-of-service attacks and brute force attempts.', 'high', 'resolved', NOW() - INTERVAL '2 days'),
    (1, 'Weak Password Policy', 'Password requirements are insufficient. Minimum length is only 6 characters with no complexity requirements.', 'medium', 'resolved', NOW() - INTERVAL '2 days');

-- Insert sample findings for audit 2 (Customer Database)
INSERT INTO findings (audit_id, title, description, severity, status, discovered_date) VALUES
    (2, 'Unencrypted Personal Data at Rest', 'Customer personally identifiable information (PII) is stored in plaintext without encryption, violating GDPR requirements.', 'critical', 'in_progress', NOW() - INTERVAL '5 days'),
    (2, 'Outdated Database Version', 'PostgreSQL version 9.6 is being used, which has known security vulnerabilities. Latest version 15.x should be deployed.', 'high', 'open', NOW() - INTERVAL '5 days'),
    (2, 'Default Admin Account Active', 'Database still has default admin account enabled with potentially weak credentials.', 'high', 'resolved', NOW() - INTERVAL '5 days'),
    (2, 'Missing Backup Encryption', 'Database backups are not encrypted, creating a potential data exposure risk.', 'medium', 'open', NOW() - INTERVAL '5 days');

-- Insert sample findings for audit 3 (Payment Processing System)
INSERT INTO findings (audit_id, title, description, severity, status, discovered_date) VALUES
    (3, 'PCI-DSS Compliance Gaps', 'System does not fully comply with PCI-DSS requirements for handling credit card data. Missing several required security controls.', 'critical', 'open', NOW() - INTERVAL '1 day'),
    (3, 'Insufficient Logging', 'Payment transactions are not comprehensively logged, making audit trails incomplete.', 'medium', 'open', NOW() - INTERVAL '1 day');

-- Insert sample findings for audit 4 (Mobile App Backend)
INSERT INTO findings (audit_id, title, description, severity, status, discovered_date) VALUES
    (4, 'Hardcoded API Keys in Source Code', 'Several API keys and secrets are hardcoded in the application source code and committed to version control.', 'critical', 'resolved', NOW() - INTERVAL '10 days'),
    (4, 'Insecure Deserialization', 'Application uses insecure deserialization of user-supplied data, potentially allowing remote code execution.', 'critical', 'resolved', NOW() - INTERVAL '10 days'),
    (4, 'Missing Input Validation', 'User input is not properly validated before processing, creating multiple injection vulnerabilities.', 'high', 'resolved', NOW() - INTERVAL '10 days');

-- Insert sample findings for audit 5 (Admin Portal)
INSERT INTO findings (audit_id, title, description, severity, status, discovered_date) VALUES
    (5, 'Excessive User Permissions', 'Several users have administrative access that exceeds their job requirements, violating principle of least privilege.', 'high', 'in_progress', NOW() - INTERVAL '3 days'),
    (5, 'No Multi-Factor Authentication', 'Admin portal does not enforce multi-factor authentication for privileged accounts.', 'high', 'open', NOW() - INTERVAL '3 days'),
    (5, 'Session Timeout Too Long', 'User sessions remain active for 24 hours, increasing risk of session hijacking.', 'medium', 'open', NOW() - INTERVAL '3 days');

-- Insert sample findings for audit 6 (Data Warehouse)
INSERT INTO findings (audit_id, title, description, severity, status, discovered_date) VALUES
    (6, 'Unpatched Security Vulnerabilities', 'Multiple critical security patches have not been applied to the data warehouse system.', 'high', 'resolved', NOW() - INTERVAL '7 days'),
    (6, 'Weak Network Segmentation', 'Data warehouse is on the same network segment as less trusted systems.', 'medium', 'resolved', NOW() - INTERVAL '7 days');

-- Insert sample findings for audit 7 (Authentication Service)
INSERT INTO findings (audit_id, title, description, severity, status, discovered_date) VALUES
    (7, 'JWT Tokens Without Expiration', 'JSON Web Tokens are issued without proper expiration times, allowing indefinite access.', 'critical', 'open', NOW() - INTERVAL '1 day'),
    (7, 'Weak Token Secret', 'JWT signing secret is weak and could be brute-forced.', 'high', 'open', NOW() - INTERVAL '1 day');

-- Insert sample findings for audit 8 (File Storage System)
INSERT INTO findings (audit_id, title, description, severity, status, discovered_date) VALUES
    (8, 'Public S3 Buckets', 'Several S3 buckets containing sensitive files are publicly accessible.', 'critical', 'resolved', NOW() - INTERVAL '14 days'),
    (8, 'No File Type Validation', 'System accepts any file type for upload without validation, creating malware upload risk.', 'high', 'resolved', NOW() - INTERVAL '14 days'),
    (8, 'Missing Virus Scanning', 'Uploaded files are not scanned for malware before storage.', 'medium', 'resolved', NOW() - INTERVAL '14 days');

-- Verify the data
SELECT 'Audits created:' as info, COUNT(*) as count FROM audits
UNION ALL
SELECT 'Findings created:' as info, COUNT(*) as count FROM findings;
