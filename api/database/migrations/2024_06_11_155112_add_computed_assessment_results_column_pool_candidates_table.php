<?php

use App\Enums\OverallAssessmentStatus;
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
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->jsonb('computed_assessment_status')->nullable()->default(json_encode([
                'assessmentStepStatuses' => [],
                'overallAssessmentStatus' => OverallAssessmentStatus::TO_ASSESS->name,
                'currentStep' => 1,
            ]));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('computed_assessment_status');
        });
    }
};
