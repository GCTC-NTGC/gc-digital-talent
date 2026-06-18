<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class() extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE pool_candidate_search_requests DROP COLUMN status_weight');
        DB::statement("UPDATE pool_candidate_search_requests SET status = 'COMPLETED' WHERE status = 'CLOSED'");
        DB::statement(<<<'SQL'
            ALTER TABLE pool_candidate_search_requests
            ADD COLUMN status_weight integer GENERATED ALWAYS AS (
            CASE
                WHEN (status::text = 'NEW'::text)         THEN 10
                WHEN (status::text = 'IN_PROGRESS'::text) THEN 20
                WHEN (status::text = 'COMPLETED'::text)   THEN 30
                ELSE NULL::integer
            END) STORED
            SQL
        );

        DB::statement('ALTER TABLE pool_candidate_search_requests RENAME COLUMN closed_details TO completion_details');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE pool_candidate_search_requests RENAME COLUMN completion_details TO closed_details');
        DB::statement('ALTER TABLE pool_candidate_search_requests DROP COLUMN status_weight');
        DB::statement("UPDATE pool_candidate_search_requests SET status = 'CLOSED' WHERE status = 'COMPLETED'");
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
};
