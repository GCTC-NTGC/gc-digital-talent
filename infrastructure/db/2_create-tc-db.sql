ALTER ROLE postgres WITH CREATEDB CREATEROLE;

\c postgres postgres;

CREATE DATABASE gctalent
    WITH OWNER = "postgres"
        ENCODING = 'UTF8'
        TABLESPACE = pg_default
        CONNECTION LIMIT = 25;
GRANT CONNECT, TEMPORARY ON DATABASE gctalent TO public;
GRANT ALL ON DATABASE gctalent TO postgres;

\c gctalent;
-- Add extensions to match what's in production
CREATE EXTENSION IF NOT EXISTS plpgsql WITH VERSION '1.0';
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH VERSION '1.3';
CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH VERSION '1.7';
CREATE EXTENSION IF NOT EXISTS unaccent;
