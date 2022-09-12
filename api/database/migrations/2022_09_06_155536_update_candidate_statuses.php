<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// status updates associated with PR 3744
class UpdateCandidateStatuses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            update pool_candidates
                set pool_candidate_status =
                    case pool_candidate_status
                        when 'AVAILABLE' then 'QUALIFIED_AVAILABLE'
                        when 'NO_LONGER_INTERESTED' then 'QUALIFIED_WITHDREW'
                        when 'UNAVAILABLE' then 'QUALIFIED_UNAVAILABLE'
                        else pool_candidate_status
                    end
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("
            update pool_candidates
                set pool_candidate_status =
                    case pool_candidate_status
                        when 'QUALIFIED_AVAILABLE' then 'AVAILABLE'
                        when 'QUALIFIED_WITHDREW' then 'NO_LONGER_INTERESTED'
                        when 'QUALIFIED_UNAVAILABLE' then 'UNAVAILABLE'
                        else pool_candidate_status
                    end
        ");
    }
}
