<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
            $table->index(
                'pool_candidate_id',
                name: 'pool_candidate_education_requirement_experience_idx1' // the auto-generated name gets truncated and is not useful
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
            $table->dropIndex('pool_candidate_education_requirement_experience_idx1');
        });
    }
};
