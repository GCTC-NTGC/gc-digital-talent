-- will apply to all new databases afterward, including temporary ones created for phpunit parallel testing
\c template1;

-- Add extensions to match what's in production
CREATE EXTENSION IF NOT EXISTS plpgsql WITH VERSION '1.0';
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH VERSION '1.3';
CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH VERSION '1.7';
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Setup unaccent for text search
CREATE TEXT SEARCH CONFIGURATION english_unaccented (copy = english);
ALTER TEXT SEARCH CONFIGURATION english_unaccented
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, english_stem;
