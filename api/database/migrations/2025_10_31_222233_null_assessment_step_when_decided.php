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
        // null out candidate's assessment step id where final_decision_at OR removed_at non-null
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET assessment_step_id = NULL
            WHERE final_decision_at IS NOT NULL OR removed_at IS NOT NULL;
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // not reversible
    }
};
