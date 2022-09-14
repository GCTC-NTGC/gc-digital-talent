<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class GeneratedCandidateStatusWeight extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE pool_candidates ADD COLUMN status_weight INT
        GENERATED ALWAYS AS
        (case
        when pool_candidate_status = 'DRAFT' then 10
        when pool_candidate_status = 'DRAFT_EXPIRED' then 20
        when pool_candidate_status = 'NEW_APPLICATION' then 30
        when pool_candidate_status = 'APPLICATION_REVIEW' then 40
        when pool_candidate_status = 'SCREENED_IN' then 50
        when pool_candidate_status = 'SCREENED_OUT_APPLICATION' then 60
        when pool_candidate_status = 'UNDER_ASSESSMENT' then 70
        when pool_candidate_status = 'SCREENED_OUT_ASSESSMENT' then 80
        when pool_candidate_status = 'QUALIFIED_AVAILABLE' then 90
        when pool_candidate_status = 'QUALIFIED_UNAVAILABLE' then 100
        when pool_candidate_status = 'QUALIFIED_WITHDREW' then 110
        when pool_candidate_status = 'PLACED_CASUAL' then 120
        when pool_candidate_status = 'PLACED_TERM' then 130
        when pool_candidate_status = 'PLACED_INDETERMINATE' then 140
        when pool_candidate_status = 'EXPIRED' then 150
        else null
        end)
        STORED;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn([
                'status_weight',
            ]);
        });
    }
}
