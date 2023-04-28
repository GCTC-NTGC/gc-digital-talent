<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pool_candidate_minimum_criteria_experience', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('pool_candidate_id')->nullable(false);
            $table->foreign('pool_candidate_id')->references('id')->on('pool_candidates');
            $table->uuid('experience_id')->nullable(false);
            $table->string('experience_type')->nullable(false);
            $table->unique(['pool_candidate_id', 'experience_id', 'experience_type']);
            $table->timestamps();
        });

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('education_requirement_option')->nullable(true)->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pool_candidate_minimum_criteria_experience');
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('education_requirement_option');
        });
    }
};
