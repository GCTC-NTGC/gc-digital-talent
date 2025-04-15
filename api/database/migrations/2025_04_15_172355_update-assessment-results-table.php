<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // add unique constraint to assessment_results table
        Schema::table('assessment_results', function (Blueprint $table) {
            $table->unique(['assessment_step_id', 'pool_candidate_id', 'pool_skill_id', 'assessment_result_type'],
                'assessment_results_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // remove the unique constraint from assessment_results table
        Schema::table('assessment_results', function (Blueprint $table) {
            $table->dropUnique('assessment_results_unique');
        });
    }
};
