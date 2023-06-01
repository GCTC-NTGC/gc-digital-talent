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
        Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
            $table->dropForeign('pool_candidate_education_requirement_experience_foreign');
            $table->foreign('pool_candidate_id', 'pool_candidate_education_requirement_experience_foreign')->references('id')->on('pool_candidates')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
            $table->dropForeign('pool_candidate_education_requirement_experience_foreign');
            $table->foreign('pool_candidate_id', 'pool_candidate_education_requirement_experience_foreign')->references('id')->on('pool_candidates');
        });
    }
};
