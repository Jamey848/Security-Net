#!/bin/bash
# Database initialization script
# This script creates the database schema and loads seed data
#
# Students can use this in their database container initialization
# For PostgreSQL, this can be placed in /docker-entrypoint-initdb.d/

set -e

echo "Initializing Security Audit Tracker database..."

# Run migrations
echo "Creating tables..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" < /migrations/001_create_tables.sql

# Load seed data
echo "Loading seed data..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" < /seeds/seed_data.sql

echo "Database initialization complete!"
