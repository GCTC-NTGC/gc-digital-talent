<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

#[Signature('app:sync-talent-requests')]
#[Description('Syncs search request rows to new talent requests table.')]
class SyncTalentRequests extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (Schema::hasTable('talent_requests') && Schema::hasTable('pool_candidate_search_requests')) {
            // Rows without an applicant_filter_id pre-date that field and can't be represented in the new schema.
            DB::statement(<<<'SQL'
            INSERT INTO talent_requests (
                id, full_name, email, job_title, hr_advisor_email, manager_job_title,
                position_type, reason, additional_comments, was_empty, initial_result_count,
                applicant_filter_id, department_id, community_id, user_id, admin_notes,
                status, in_progress_details, completion_details, follow_up_date,
                status_changed_at, created_at, updated_at, deleted_at
            )
            SELECT
                pcsr.id, pcsr.full_name, pcsr.email, pcsr.job_title, pcsr.hr_advisor_email, pcsr.manager_job_title,
                pcsr.position_type, pcsr.reason, pcsr.additional_comments, pcsr.was_empty, pcsr.initial_result_count,
                pcsr.applicant_filter_id, pcsr.department_id, pcsr.community_id, pcsr.user_id, pcsr.admin_notes,
                pcsr.status, pcsr.in_progress_details, pcsr.completion_details, pcsr.follow_up_date,
                pcsr.request_status_changed_at, pcsr.created_at, pcsr.updated_at, pcsr.deleted_at
            FROM pool_candidate_search_requests AS pcsr
            WHERE pcsr.applicant_filter_id IS NOT NULL
            ON CONFLICT (id) DO UPDATE SET
                status = EXCLUDED.status,
                in_progress_details = EXCLUDED.in_progress_details,
                completion_details = EXCLUDED.completion_details,
                status_changed_at = EXCLUDED.status_changed_at,
                follow_up_date = EXCLUDED.follow_up_date,
                admin_notes = EXCLUDED.admin_notes,
                updated_at = EXCLUDED.updated_at
            WHERE EXCLUDED.updated_at > talent_requests.updated_at;
            SQL
            );

            // Duplicated rather than moved — PoolCandidateSearchRequest history must remain intact during transition.
            DB::statement(<<<'SQL'
            INSERT INTO activity_log (
                id, log_name, description, subject_type, subject_id,
                causer_type, causer_id, properties, attribute_changes,
                created_at, updated_at, event
            )
            SELECT
                gen_random_uuid(),
                source_log.log_name,
                source_log.description,
                'App\Models\TalentRequest',
                source_log.subject_id,
                source_log.causer_type,
                source_log.causer_id,
                source_log.properties,
                source_log.attribute_changes,
                source_log.created_at,
                source_log.updated_at,
                source_log.event
            FROM activity_log AS source_log
            WHERE source_log.subject_type = 'App\Models\PoolCandidateSearchRequest'
            AND source_log.subject_id IN (SELECT id FROM talent_requests)
            AND NOT EXISTS (
                SELECT 1
                FROM activity_log AS target_log
                WHERE target_log.subject_type = 'App\Models\TalentRequest'
                    AND target_log.subject_id = source_log.subject_id
                    AND target_log.created_at = source_log.created_at
            );
            SQL
            );
        }
    }
}
