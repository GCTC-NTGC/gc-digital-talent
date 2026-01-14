<?php

use App\Enums\ApplicationStatus;
use App\Enums\PlacementType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            // Set nullable at first until we move data over
            $table->string('application_status')->default(ApplicationStatus::DRAFT->name)->nullable();
            $table->string('disqualification_reason')->nullable();
            $table->dateTime('disqualified_at')->nullable();
            $table->dateTime('qualified_at')->nullable();
            $table->string('placement_type')->default(PlacementType::NOT_PLACED->name)->nullable();
            $table->boolean('referring')->default(true);
            $table->dropColumn('status_weight');
        });

        // 1. application_status for EXPIRED using computed_final_decision
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET application_status = CASE
                WHEN computed_final_decision LIKE '%REMOVED%' THEN 'REMOVED'
                WHEN computed_final_decision LIKE 'DISQUALIFIED%' THEN 'DISQUALIFIED'
                WHEN computed_final_decision LIKE 'QUALIFIED%' THEN 'QUALIFIED'
                WHEN computed_final_decision LIKE 'TO_ASSESS%' THEN 'TO_ASSESS'
                ELSE 'TO_ASSESS'
            END
            WHERE pool_candidate_status = 'EXPIRED'
        SQL);

        // 2. application_status for non-EXPIRED using pool_candidate_status
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET application_status = CASE pool_candidate_status
                WHEN 'DRAFT' THEN 'DRAFT'
                WHEN 'DRAFT_EXPIRED' THEN 'DRAFT'
                WHEN 'NEW_APPLICATION' THEN 'TO_ASSESS'
                WHEN 'APPLICATION_REVIEW' THEN 'TO_ASSESS'
                WHEN 'SCREENED_IN' THEN 'TO_ASSESS'
                WHEN 'UNDER_ASSESSMENT' THEN 'TO_ASSESS'
                WHEN 'SCREENED_OUT_APPLICATION' THEN 'DISQUALIFIED'
                WHEN 'SCREENED_OUT_ASSESSMENT' THEN 'DISQUALIFIED'
                WHEN 'SCREENED_OUT_NOT_INTERESTED' THEN 'REMOVED'
                WHEN 'SCREENED_OUT_NOT_RESPONSIVE' THEN 'REMOVED'
                WHEN 'REMOVED' THEN 'REMOVED'
                WHEN 'QUALIFIED_WITHDREW' THEN 'REMOVED'
                ELSE 'QUALIFIED'
            END
            WHERE pool_candidate_status != 'EXPIRED'
        SQL);

        // 3. disqualification_reason
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET disqualification_reason = pool_candidate_status
            WHERE pool_candidate_status IN ('SCREENED_OUT_ASSESSMENT', 'SCREENED_OUT_APPLICATION')
        SQL);

        // 4. removal_reason
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET removal_reason = 'REQUESTED_TO_BE_WITHDRAWN'
            WHERE pool_candidate_status IN ('SCREENED_OUT_NOT_INTERESTED', 'QUALIFIED_WITHDREW')
                AND removal_reason IS NULL
        SQL);
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET removal_reason = 'NOT_RESPONSIVE'
            WHERE pool_candidate_status IN ('SCREENED_OUT_NOT_RESPONSIVE', 'QUALIFIED_UNAVAILABLE')
                AND removal_reason IS NULL
        SQL);

        // 5. placement_type (UNDER_CONSIDERATION first)
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET placement_type = 'UNDER_CONSIDERATION'
            WHERE pool_candidate_status = 'UNDER_CONSIDERATION'
        SQL);
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET placement_type = pool_candidate_status
            WHERE pool_candidate_status LIKE 'PLACED_%'
        SQL);

        // 6. referring (QUALIFIED_WITHDREW  = false)
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET referring = false
            WHERE pool_candidate_status = 'QUALIFIED_UNAVAILABLE'
        SQL);

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('application_status')->default('DRAFT')->nullable(false)->change();
        });

        // 7. Add status_weight with new statuses
        DB::statement(<<<'SQL'
            ALTER TABLE pool_candidates
            ADD COLUMN status_weight integer GENERATED ALWAYS AS (
            CASE
                WHEN ((application_status)::text = 'DRAFT'::text) THEN 10
                WHEN ((application_status)::text = 'TO_ASSESS'::text) THEN 20
                WHEN ((application_status)::text = 'DISQUALIFIED'::text) THEN 30
                WHEN ((application_status)::text = 'QUALIFIED'::text) THEN 40
                WHEN ((application_status)::text = 'REMOVED'::text) THEN 50
                ELSE NULL::integer
            END
            ) STORED;
            SQL
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('application_status');
            $table->dropColumn('disqualification_reason');
            $table->dropColumn('disqualified_at');
            $table->dropColumn('qualified_at');
            $table->dropColumn('placement_type');
        });
    }
};
