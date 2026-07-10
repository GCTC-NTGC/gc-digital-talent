<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        // Placement fields are subfields of the QUALIFIED status.
        // Fix data to match: qualified candidates get NOT_PLACED,
        // non-qualified candidates get NULL.
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET placement_type = 'NOT_PLACED'
            WHERE application_status = 'QUALIFIED'
            AND placement_type IS NULL
        SQL);

        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET placement_type = NULL,
                placed_at = NULL,
                placed_department_id = NULL,
                placed_start_date = NULL,
                placed_end_date = NULL
            WHERE application_status != 'QUALIFIED'
            AND placement_type IS NOT NULL
        SQL);

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('placement_type')->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('placement_type')->nullable()->default('NOT_PLACED')->change();
        });

        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET placement_type = 'NOT_PLACED'
            WHERE placement_type IS NULL
        SQL);
    }
};
