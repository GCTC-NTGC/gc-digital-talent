-- will apply to all new databases afterward, including temporary ones created for phpunit parallel testing
\c template1;

-- Add extensions to match what's in production
CREATE EXTENSION IF NOT EXISTS plpgsql WITH VERSION '1.0';
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH VERSION '1.3';
CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH VERSION '1.7';
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Setup unaccent for text search
CREATE TEXT SEARCH CONFIGURATION english_unaccented (copy = english);
ALTER TEXT SEARCH CONFIGURATION english_unaccented
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, english_stem;

-- Copy of the C function declared immutable.  Do not use this directly.
CREATE OR REPLACE FUNCTION public.immutable_unaccent(regdictionary, text)
  RETURNS text
  LANGUAGE c IMMUTABLE PARALLEL SAFE STRICT AS
'$libdir/unaccent', 'unaccent_dict';

-- Immutable SQL wrapper  with hard-wired, schema-qualified function and dictionary.  Can be used in indexes or directly.
CREATE OR REPLACE FUNCTION public.f_unaccent(text)
  RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
RETURN public.immutable_unaccent(regdictionary 'public.unaccent', $1);
