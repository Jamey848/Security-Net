# db/Dockerfile
FROM postgres:15-alpine

#Copy database structure
COPY migrations/001_create_tables.sql /docker-entrypoint-initdb.d/

# Copy example data
COPY seeds/seed_data.sql /docker-entrypoint-initdb.d/002_seed_data.sql

# Expose default Postgres port
EXPOSE 5432