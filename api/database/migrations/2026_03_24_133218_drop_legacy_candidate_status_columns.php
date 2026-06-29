<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn([
                'referring',
                'pool_candidate_status',
                'computed_final_decision',
                'computed_final_decision_weight',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('pool_candidate_status', 255)->nullable();
            $table->string('computed_final_decision')->nullable();
            $table->integer('computed_final_decision_weight')->nullable();
            $table->boolean('referring')->default(true);
        });

        // This reverses the logic in add_application_status_column_pool_candidates_table
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET pool_candidate_status = CASE
                WHEN application_status = 'DRAFT' THEN 'DRAFT'
                WHEN application_status = 'DISQUALIFIED' THEN disqualification_reason
                WHEN application_status = 'REMOVED' AND removal_reason = 'NOT_RESPONSIVE' THEN 'SCREENED_OUT_NOT_RESPONSIVE'
                WHEN application_status = 'REMOVED' THEN 'SCREENED_OUT_NOT_INTERESTED'
                WHEN placement_type LIKE 'PLACED_%' THEN placement_type
                WHEN application_status = 'QUALIFIED' THEN 'QUALIFIED_AVAILABLE'
                WHEN application_status = 'TO_ASSESS' THEN 'NEW_APPLICATION'
                ELSE 'DRAFT'
            END
        SQL);

        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET computed_final_decision = CASE
                WHEN application_status = 'REMOVED' THEN 'REMOVED'
                WHEN application_status = 'DISQUALIFIED' THEN 'DISQUALIFIED'
                WHEN application_status = 'QUALIFIED' THEN 'QUALIFIED'
                WHEN application_status = 'TO_ASSESS' THEN 'TO_ASSESS'
                ELSE 'TO_ASSESS'
            END
        SQL);

        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET computed_final_decision_weight = CASE
                WHEN pool_candidate_status = 'DRAFT' THEN 10
                WHEN pool_candidate_status = 'DRAFT_EXPIRED' THEN 20
                WHEN pool_candidate_status = 'NEW_APPLICATION' THEN 30
                WHEN pool_candidate_status = 'APPLICATION_REVIEW' THEN 40
                WHEN pool_candidate_status = 'SCREENED_IN' THEN 50
                WHEN pool_candidate_status = 'SCREENED_OUT_APPLICATION' THEN 60
                WHEN pool_candidate_status = 'SCREENED_OUT_NOT_INTERESTED' THEN 64
                WHEN pool_candidate_status = 'SCREENED_OUT_NOT_RESPONSIVE' THEN 65
                WHEN pool_candidate_status = 'UNDER_ASSESSMENT' THEN 70
                WHEN pool_candidate_status = 'SCREENED_OUT_ASSESSMENT' THEN 80
                WHEN pool_candidate_status = 'QUALIFIED_AVAILABLE' THEN 90
                WHEN pool_candidate_status = 'QUALIFIED_UNAVAILABLE' THEN 100
                WHEN pool_candidate_status = 'QUALIFIED_WITHDREW' THEN 110
                WHEN pool_candidate_status = 'PLACED_TENTATIVE' THEN 115
                WHEN pool_candidate_status = 'PLACED_CASUAL' THEN 120
                WHEN pool_candidate_status = 'PLACED_TERM' THEN 130
                WHEN pool_candidate_status = 'PLACED_INDETERMINATE' THEN 140
                WHEN pool_candidate_status = 'EXPIRED' THEN 150
                WHEN pool_candidate_status = 'REMOVED' THEN 160
                ELSE NULL
            END
        SQL);
    }
};
