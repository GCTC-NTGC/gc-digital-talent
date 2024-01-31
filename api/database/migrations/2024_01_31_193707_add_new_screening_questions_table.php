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
        // foreign key names needed updating
        // unique key needed updating
        Schema::table('general_questions', function (Blueprint $table) {
            $table->dropForeign('screening_questions_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('general_question_responses', function (Blueprint $table) {
            $table->dropForeign('screening_question_responses_screening_question_id_foreign');
            $table->foreign('general_question_id')->references('id')->on('general_questions')->cascadeOnDelete(true);
            $table->dropForeign('screening_question_responses_pool_candidate_id_foreign');
            $table->foreign('pool_candidate_id')->references('id')->on('pool_candidates')->cascadeOnDelete(true);

            $table->dropUnique('screening_question_responses_pool_candidate_id_screening_question_id_unique');
            $table->unique(['pool_candidate_id', 'general_question_id']);
        });

        Schema::create('screening_questions', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('pool_id');
            $table->foreign('pool_id')->references('id')->on('pools');
            $table->uuid('assessment_step_id');
            $table->foreign('assessment_step_id')->references('id')->on('assessment_steps');
            $table->integer('sort_order')->nullable()->default(null);
            $table->jsonb('question');
            $table->timestamps();
        });

        Schema::create('screening_question_responses', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('pool_candidate_id');
            $table->foreign('pool_candidate_id')->references('id')->on('pool_candidates')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->uuid('screening_question_id');
            $table->foreign('screening_question_id')->references('id')->on('screening_questions')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->text('answer');
            $table->unique(['pool_candidate_id', 'screening_question_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screening_question_responses');
        Schema::dropIfExists('screening_questions');

        // make migration reversible by recreating the incorrect foreign key names
        Schema::rename('general_questions', 'screening_questions');
        Schema::rename('general_question_responses', 'screening_question_responses');
        Schema::table('screening_question_responses', function (Blueprint $table) {
            $table->renameColumn('general_question_id', 'screening_question_id');
        });

        Schema::table('screening_questions', function (Blueprint $table) {
            $table->dropForeign('general_questions_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('screening_question_responses', function (Blueprint $table) {
            $table->dropForeign('general_question_responses_general_question_id_foreign');
            $table->foreign('screening_question_id')->references('id')->on('screening_questions')->cascadeOnDelete(true);
            $table->dropForeign('general_question_responses_pool_candidate_id_foreign');
            $table->foreign('pool_candidate_id')->references('id')->on('pool_candidates')->cascadeOnDelete(true);

            $table->dropUnique('general_question_responses_pool_candidate_id_general_question_id_unique');
            $table->unique(['pool_candidate_id', 'screening_question_id']);
        });

        Schema::rename('screening_questions', 'general_questions');
        Schema::rename('screening_question_responses', 'general_question_responses');
        Schema::table('general_question_responses', function (Blueprint $table) {
            $table->renameColumn('screening_question_id', 'general_question_id');
        });
    }
};
