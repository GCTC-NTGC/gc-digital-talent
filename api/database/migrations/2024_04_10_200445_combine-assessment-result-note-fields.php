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
        DB::statement("UPDATE assessment_results SET skill_decision_notes = CONCAT(
            skill_decision_notes, CHR(13),CHR(10),
            'Notes for this assessment: ', assessment_notes
        ) WHERE assessment_notes IS NOT NULL");

        DB::statement("UPDATE assessment_results SET skill_decision_notes = CONCAT(
            skill_decision_notes, CHR(13),CHR(10),
            'Other justification notes:  ', other_justification_notes
        ) WHERE other_justification_notes IS NOT NULL");

        Schema::table('assessment_results', function (Blueprint $table) {
            $table->dropColumn('assessment_notes');
            $table->dropColumn('other_justification_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->text('assessment_notes')->nullable()->default(null);
            $table->text('other_justification_notes')->nullable()->default(null);
        });
    }
};
