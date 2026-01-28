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
            $table->dateTime('status_updated_at')->nullable();
            $table->string('placement_type')->default(PlacementType::NOT_PLACED->name)->nullable();
            $table->boolean('referring')->default(true);
            $table->dropColumn('status_weight');
        });

        // application_status for EXPIRED using computed_final_decision
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

        // application_status for non-EXPIRED using pool_candidate_status
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

        // disqualification_reason
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET disqualification_reason = pool_candidate_status
            WHERE pool_candidate_status IN ('SCREENED_OUT_ASSESSMENT', 'SCREENED_OUT_APPLICATION')
        SQL);

        // removal_reason
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

        // placement_type (UNDER_CONSIDERATION first)
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

        // referring (QUALIFIED_WITHDREW  = false)
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET referring = false
            WHERE pool_candidate_status = 'QUALIFIED_UNAVAILABLE'
        SQL);

        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET status_updated_at =
                CASE
                    WHEN removed_at IS NOT NULL THEN removed_at
                    ELSE final_decision_at
                END
        SQL);

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('final_decision_at');
            $table->dropColumn('removed_at');
            $table->string('application_status')->default('DRAFT')->nullable(false)->change();
        });

        // Add status_weight with new statuses
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
            END) STORED;
            SQL
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->timestamp('final_decision_at')->nullable();
            $table->timestamp('removed_at')->nullable();
        });

        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET
                removed_at = CASE WHEN application_status = 'REMOVED' THEN status_updated_at ELSE NULL END,
                final_decision_at = CASE
                    WHEN application_status IN ('QUALIFIED', 'DISQUALIFIED') THEN status_updated_at
                    ELSE NULL
                END;
        SQL);

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('status_weight');
            $table->dropColumn('application_status');
            $table->dropColumn('disqualification_reason');
            $table->dropColumn('status_updated_at');
            $table->dropColumn('placement_type');
            $table->dropColumn('referring');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE pool_candidates
            ADD COLUMN status_weight integer GENERATED ALWAYS AS (
            CASE
                WHEN ((pool_candidate_status)::text = 'DRAFT'::text) THEN 10
                WHEN ((pool_candidate_status)::text = 'DRAFT_EXPIRED'::text) THEN 20
                WHEN ((pool_candidate_status)::text = 'NEW_APPLICATION'::text) THEN 30
                WHEN ((pool_candidate_status)::text = 'APPLICATION_REVIEW'::text) THEN 40
                WHEN ((pool_candidate_status)::text = 'SCREENED_IN'::text) THEN 50
                WHEN ((pool_candidate_status)::text = 'SCREENED_OUT_APPLICATION'::text) THEN 60
                WHEN ((pool_candidate_status)::text = 'SCREENED_OUT_NOT_INTERESTED'::text) THEN 64
                WHEN ((pool_candidate_status)::text = 'SCREENED_OUT_NOT_RESPONSIVE'::text) THEN 65
                WHEN ((pool_candidate_status)::text = 'UNDER_ASSESSMENT'::text) THEN 70
                WHEN ((pool_candidate_status)::text = 'SCREENED_OUT_ASSESSMENT'::text) THEN 80
                WHEN ((pool_candidate_status)::text = 'QUALIFIED_AVAILABLE'::text) THEN 90
                WHEN ((pool_candidate_status)::text = 'QUALIFIED_UNAVAILABLE'::text) THEN 100
                WHEN ((pool_candidate_status)::text = 'QUALIFIED_WITHDREW'::text) THEN 110
                WHEN ((pool_candidate_status)::text = 'PLACED_TENTATIVE'::text) THEN 115
                WHEN ((pool_candidate_status)::text = 'PLACED_CASUAL'::text) THEN 120
                WHEN ((pool_candidate_status)::text = 'PLACED_TERM'::text) THEN 130
                WHEN ((pool_candidate_status)::text = 'PLACED_INDETERMINATE'::text) THEN 140
                WHEN ((pool_candidate_status)::text = 'EXPIRED'::text) THEN 150
                WHEN ((pool_candidate_status)::text = 'REMOVED'::text) THEN 160
                ELSE NULL::integer
            END) STORED;
        SQL);
    }
};
