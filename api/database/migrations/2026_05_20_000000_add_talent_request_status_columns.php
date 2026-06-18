<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->string('status')->default('NEW');
            $table->string('in_progress_details')->nullable();
            $table->string('closed_details')->nullable();
        });

        // Backfill status (and closed_details where applicable) from legacy request_status
        DB::statement(<<<'SQL'
            UPDATE pool_candidate_search_requests SET
                status = CASE
                    WHEN request_status = 'DONE'               THEN 'CLOSED'
                    WHEN request_status = 'DONE_NO_CANDIDATES'  THEN 'CLOSED'
                    WHEN request_status = 'NOT_COMPLIANT'       THEN 'CLOSED'
                    WHEN request_status = 'WAITING'             THEN 'IN_PROGRESS'
                    WHEN request_status = 'IN_PROGRESS'         THEN 'IN_PROGRESS'
                    ELSE 'NEW'
                END,
                closed_details = CASE
                    WHEN request_status = 'DONE'               THEN 'HIRE_MADE'
                    WHEN request_status = 'DONE_NO_CANDIDATES'  THEN 'NO_CANDIDATES_FOUND'
                    WHEN request_status = 'NOT_COMPLIANT'       THEN 'NON_COMPLIANT'
                    ELSE NULL
                END
            SQL
        );

        DB::statement(<<<'SQL'
            ALTER TABLE pool_candidate_search_requests
            ADD COLUMN status_weight integer GENERATED ALWAYS AS (
            CASE
                WHEN (status::text = 'NEW'::text)         THEN 10
                WHEN (status::text = 'IN_PROGRESS'::text) THEN 20
                WHEN (status::text = 'CLOSED'::text)      THEN 30
                ELSE NULL::integer
            END) STORED
            SQL
        );
    }

    public function down(): void
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropColumn(['status_weight', 'status', 'in_progress_details', 'closed_details']);
        });
    }
};
