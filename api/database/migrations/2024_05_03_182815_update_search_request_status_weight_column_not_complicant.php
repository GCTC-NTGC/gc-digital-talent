<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE pool_candidate_search_requests DROP COLUMN request_status_weight;');
        DB::statement(
            <<<'SQL'
                ALTER TABLE pool_candidate_search_requests
                    ADD COLUMN request_status_weight INT
                    GENERATED ALWAYS AS
                        (case
                            when request_status = 'NEW' then 10
                            when request_status = 'IN_PROGRESS' then 20
                            when request_status = 'WAITING' then 30
                            when request_status = 'DONE' then 40
                            when request_status = 'DONE_NO_CANDIDATES' then 41
                            when request_status = 'NOT_COMPLIANT' then 50
                        end)
                STORED;
                SQL,
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE pool_candidate_search_requests DROP COLUMN request_status_weight;');
        DB::statement(
            <<<'SQL'
                ALTER TABLE pool_candidate_search_requests
                    ADD COLUMN request_status_weight INT
                    GENERATED ALWAYS AS
                        (case
                            when request_status = 'NEW' then 10
                            when request_status = 'IN_PROGRESS' then 20
                            when request_status = 'WAITING' then 30
                            when request_status = 'DONE' then 40
                        end)
                STORED;
                SQL,
        );
    }
};
