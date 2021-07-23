ALTER ROLE postgres WITH CREATEDB CREATEROLE;

\c postgres postgres;

CREATE DATABASE gctalent_auth
    WITH OWNER = "postgres"
        ENCODING = 'UTF8'
        TABLESPACE = pg_default
        CONNECTION LIMIT = 25;
GRANT CONNECT, TEMPORARY ON DATABASE gctalent_auth TO public;
GRANT ALL ON DATABASE gctalent_auth TO postgres;
