--- Set new shared_preload_libraries (include any existing values and comma-separate them from the new value)
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
