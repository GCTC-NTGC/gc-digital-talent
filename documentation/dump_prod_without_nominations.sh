#!/usr/bin/env bash
#
# Dump the production database for sharing with people who may not see
# talent-nomination data. The source database is only read, never modified.
#
#   - Nomination tables keep their schema but have no rows.
#   - activity_log is dumped separately via a filtered COPY, so entries about
#     TalentNomination, TalentNominationGroup and TalentNominationEvent are
#     dropped while all other activity is kept.
#
# Connection details come from the standard libpq env vars:
#   PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD (or ~/.pgpass), PGSSLMODE
#
# Usage: [OUTPUT_DIR=dir] ./dump_prod_without_nominations.sh [output_dir]
#   Output directory: positional arg, else $OUTPUT_DIR, else the current directory.

set -euo pipefail

readonly OUTPUT_DIR="${1:-${OUTPUT_DIR:-.}}"
readonly TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
readonly OUTPUT_FILE="${OUTPUT_DIR}/${PGDATABASE:-gctalent}_no_nominations_${TIMESTAMP}.sql.gz"

# Matches all nomination tables, e.g. talent_nominations, talent_nomination_groups,
# talent_nomination_events, skill_talent_nomination, and the
# classification_/development_program_/community_development_program_ pivots.
readonly NOMINATION_TABLE_PATTERN='public.*talent_nomination*'

# subject_type holds the full model class name (no morph map), e.g.
# App\Models\TalentNomination. Matching on the class-name fragment avoids
# backslash-escaping headaches in LIKE. NULL subject_type rows are kept.
readonly ACTIVITY_LOG_FILTER="coalesce(subject_type, '') NOT LIKE '%TalentNomination%'"

# Fail early if a required connection variable is missing.
require_env() {
	local name missing=()
	for name in PGHOST PGDATABASE PGUSER; do
		[[ -n "${!name:-}" ]] || missing+=("$name")
	done
	if (( ${#missing[@]} > 0 )); then
		echo "Missing required env vars: ${missing[*]}" >&2
		exit 1
	fi
}

# Run a read-only query and print bare results.
query() {
	psql --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --command "$1"
}

# Print what will be excluded, so the operator can sanity-check before sharing.
report_exclusions() {
	echo "Excluding all data from:"
	query "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%talent\_nomination%' ORDER BY 1;" \
		| sed 's/^/  - /'

	echo "Excluding activity_log rows by subject_type:"
	query "SELECT subject_type || ': ' || count(*) FROM public.activity_log WHERE NOT (${ACTIVITY_LOG_FILTER}) GROUP BY subject_type ORDER BY 1;" \
		| sed 's/^/  - /'

	# Kept rows that still mention nominations in their payload would leak data; flag them.
	local leaked_count
	leaked_count=$(query "SELECT count(*) FROM public.activity_log WHERE ${ACTIVITY_LOG_FILTER} AND (properties::text ILIKE '%nominat%' OR description ILIKE '%nominat%');")
	if [[ "$leaked_count" != "0" ]]; then
		echo "WARNING: ${leaked_count} kept activity_log rows mention 'nominat' in properties/description. Review before sharing." >&2
	fi
}

# Emit the full dump (minus nomination data and activity_log rows) as plain SQL.
dump_main() {
	pg_dump \
		--format=plain \
		--no-owner \
		--no-privileges \
		--exclude-table-data="$NOMINATION_TABLE_PATTERN" \
		--exclude-table-data='public.activity_log'
}

# Emit a COPY block restoring only the non-nomination activity_log rows.
# Appended after pg_dump's output, so it loads once the table and indexes exist.
# SELECT * column order matches the table definition in the same dump.
dump_filtered_activity_log() {
	echo
	echo "-- Filtered activity_log data (talent nomination entries removed)"
	echo "COPY public.activity_log FROM stdin;"
	query "COPY (SELECT * FROM public.activity_log WHERE ${ACTIVITY_LOG_FILTER} ORDER BY created_at) TO STDOUT;"
	echo '\.'
}

# Remove a partially written dump if anything fails.
cleanup_on_error() {
	echo "Dump failed; removing partial file ${OUTPUT_FILE}" >&2
	rm -f "$OUTPUT_FILE"
}

main() {
	require_env
	mkdir -p "$OUTPUT_DIR"
	report_exclusions

	trap cleanup_on_error ERR

	# Stream straight into gzip so the uncompressed dump never hits disk.
	# pipefail ensures a pg_dump/psql failure isn't masked by gzip succeeding.
	{ dump_main; dump_filtered_activity_log; } | gzip -9 > "$OUTPUT_FILE"

	trap - ERR
	echo "Wrote ${OUTPUT_FILE} ($(du -h "$OUTPUT_FILE" | cut -f1))"
}

main "$@"
