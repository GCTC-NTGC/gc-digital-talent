/* This query is used to collect metrics from the database for importing into Azure Log Analytics.
 * It is stored here just for future reference */

/* queries from pgAdmin dashboard*/
select now() as "date", count(*) as value, 'total' as "name", 'server sessions' as "group"
from pg_catalog.pg_stat_activity
union all
select now() as "date", count(*) as value, 'active' as "name", 'server sessions' as "group"
from pg_catalog.pg_stat_activity
where state = 'active'
union all
select now() as "date", count(*) as value, 'idle' as "name", 'server sessions' as "group"
from pg_catalog.pg_stat_activity
where state = 'idle'
union all
select now() as "date", sum(xact_commit) + sum(xact_rollback) as value, 'transactions' as "name", 'transactions per second' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(xact_commit) as value, 'commits' as "name", 'transactions per second' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(xact_rollback) as value, 'rollbacks' as "name", 'transactions per second' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(tup_inserted) as value, 'inserts' as "name", 'tuples in' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(tup_updated) as value, 'updates' as "name", 'tuples in' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(tup_deleted) as value, 'deletes' as "name", 'tuples in' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(tup_fetched) as value, 'fetched' as "name", 'tuples out' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(tup_returned) as value, 'returned' as "name", 'tuples out' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(blks_read) as value, 'reads' as "name", 'block io' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(blks_hit) as value, 'hits' as "name", 'block io' as "group"
from pg_catalog.pg_stat_database
union all
select now() as "date", sum(blks_hit) as value, 'hits' as "name", 'block io' as "group"
from pg_catalog.pg_stat_database

union all

/* basic pg_stat_statements analysis queries */
select now() as "date", count(*) as value, 'count slow queries' as "name", 'statement analysis' as "group"
from pg_stat_statements
inner join pg_database datab on dbid=datab.oid
where pg_stat_statements.mean_time > 10
and datab.datname = 'gctalent'
union all
select now() as "date", max(pg_stat_statements.mean_time) as value, 'max mean time' as "name", 'statement analysis' as "group"
from pg_stat_statements
inner join pg_database datab on dbid=datab.oid
where datab.datname = 'gctalent'

