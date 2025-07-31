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
            $table->integer('assessment_step')->nullable()->default(1);
        });

        DB::statement("UPDATE pool_candidates SET assessment_step = (computed_assessment_status->>'currentStep')::int WHERE computed_assessment_status IS NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
                SET computed_assessment_status = jsonb_set(
                    COALESCE(computed_assessment_status, '{}'::jsonb),
                    '{currentStep}',
                    COALESCE(to_jsonb(assessment_step), 'null'::jsonb)
                )
        SQL);

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('assessment_step');
        });

    }
};
