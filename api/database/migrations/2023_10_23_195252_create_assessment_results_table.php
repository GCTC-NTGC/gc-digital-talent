<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessment_results', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            // belongsTo three tables, the third relation to PoolSkill model is nullable for education assessments currently
            $table->uuid('assessment_step_id');
            $table->foreign('assessment_step_id')->references('id')->on('assessment_steps');
            $table->uuid('pool_candidate_id');
            $table->foreign('pool_candidate_id')->references('id')->on('pool_candidates')->cascadeOnDelete(true);
            $table->uuid('pool_skill_id')->nullable();
            $table->foreign('pool_skill_id')->references('id')->on('pool_skill');
            // fields
            $table->string('assessment_result_type')->nullable();
            $table->string('assessment_decision')->nullable();
            $table->jsonb('justifications')->default(new Expression('\'[]\'::jsonb'))->nullable();
            $table->text('other_justification_notes')->nullable();
            $table->string('assessment_decision_level')->nullable();
            $table->text('skill_decision_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_results');
    }
};
