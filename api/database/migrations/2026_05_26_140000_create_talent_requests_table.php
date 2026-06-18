<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        Schema::create('talent_requests', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->string('full_name');
            $table->string('email');
            $table->string('job_title');
            $table->string('hr_advisor_email')->nullable();
            $table->string('manager_job_title')->nullable();
            $table->string('position_type')->nullable();
            $table->string('reason')->nullable();
            $table->text('additional_comments')->nullable();

            $table->boolean('was_empty')->default(false);
            $table->integer('initial_result_count')->nullable();

            $table->foreignUuid('applicant_filter_id')->constrained('applicant_filters');
            $table->foreignUuid('department_id')->constrained('departments');
            $table->foreignUuid('community_id')->constrained('communities');
            $table->foreignUuid('user_id')->nullable()->constrained('users');

            $table->text('admin_notes')->nullable();
            $table->string('status')->default('NEW');
            $table->string('in_progress_details')->nullable();
            $table->string('completion_details')->nullable();
            $table->date('follow_up_date')->nullable();

            $table->timestamp('status_changed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement(<<<'SQL'
            ALTER TABLE talent_requests
            ADD COLUMN status_weight integer GENERATED ALWAYS AS (
            CASE
                WHEN (status::text = 'NEW'::text)         THEN 10
                WHEN (status::text = 'IN_PROGRESS'::text) THEN 20
                WHEN (status::text = 'COMPLETED'::text)   THEN 30
                ELSE NULL::integer
            END) STORED
            SQL
        );

        // Rows without an applicant_filter_id pre-date that field and can't be represented in the new schema.
        DB::statement(<<<'SQL'
            INSERT INTO talent_requests (
                id,
                full_name,
                email,
                job_title,
                hr_advisor_email,
                manager_job_title,
                position_type,
                reason,
                additional_comments,
                was_empty,
                initial_result_count,
                applicant_filter_id,
                department_id,
                community_id,
                user_id,
                admin_notes,
                status,
                in_progress_details,
                completion_details,
                follow_up_date,
                status_changed_at,
                created_at,
                updated_at,
                deleted_at
            )
            SELECT
                id,
                full_name,
                email,
                job_title,
                hr_advisor_email,
                manager_job_title,
                position_type,
                reason,
                additional_comments,
                was_empty,
                initial_result_count,
                applicant_filter_id,
                department_id,
                community_id,
                user_id,
                admin_notes,
                status,
                in_progress_details,
                completion_details,
                follow_up_date,
                request_status_changed_at,
                created_at,
                updated_at,
                deleted_at
            FROM pool_candidate_search_requests
            WHERE applicant_filter_id IS NOT NULL
            SQL
        );

        // Duplicated rather than moved — PoolCandidateSearchRequest history must remain intact during transition.
        DB::statement(<<<'SQL'
            INSERT INTO activity_log (
                id,
                log_name,
                description,
                subject_type,
                subject_id,
                causer_type,
                causer_id,
                properties,
                attribute_changes,
                created_at,
                updated_at,
                event
            )
            SELECT
                gen_random_uuid(),
                log_name,
                description,
                'App\Models\TalentRequest',
                subject_id,
                causer_type,
                causer_id,
                properties,
                attribute_changes,
                created_at,
                updated_at,
                event
            FROM activity_log
            WHERE subject_type = 'App\Models\PoolCandidateSearchRequest'
              AND subject_id IN (SELECT id FROM talent_requests)
            SQL
        );
    }

    public function down(): void
    {
        DB::statement(<<<'SQL'
            DELETE FROM activity_log
            WHERE subject_type = 'App\Models\TalentRequest'
              AND subject_id IN (SELECT id FROM talent_requests)
            SQL
        );

        Schema::dropIfExists('talent_requests');
    }
};
