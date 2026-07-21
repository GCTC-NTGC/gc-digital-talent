<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement(<<<'SQL'
            UPDATE applicant_filters
            SET talent_sources = '["QUALIFIED_IN_POOL"]'
            WHERE id IN (
                SELECT applicant_filter_id FROM talent_requests
                WHERE created_at < '2026-07-24'
            )
            AND (talent_sources IS NULL OR talent_sources = '[]'::jsonb)
            SQL
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement(<<<'SQL'
            UPDATE applicant_filters
            SET talent_sources = '[]'
            WHERE id IN (
                SELECT applicant_filter_id FROM talent_requests
                WHERE created_at < '2026-07-24'
            )
            AND talent_sources = '["QUALIFIED_IN_POOL"]'::jsonb
            SQL
        );
    }
};
