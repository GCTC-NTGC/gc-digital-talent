<?php

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
            $table->foreignUuid('assessment_step_id')
                ->nullable()
                ->constrained()
                ->onDelete('restrict');
        });

        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET assessment_step_id = (
                SELECT id
                FROM assessment_steps
                WHERE pool_id = pool_candidates.pool_id
                    AND sort_order = pool_candidates.assessment_step
                ORDER BY id
                LIMIT 1
            )
            WHERE assessment_step IS NOT NULL;
        SQL);

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('assessment_step');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->integer('assessment_step')->nullable()->default(1);
        });

        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET assessment_step = step."order"
            FROM assessment_steps AS step
            WHERE pool_candidates.assessment_step_id = step.id
              AND pool_candidates.assessment_step_id IS NOT NULL
        SQL);

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropForeign(['assessment_step_id']);
            $table->dropColumn('assessment_step_id');
        });
    }
};
