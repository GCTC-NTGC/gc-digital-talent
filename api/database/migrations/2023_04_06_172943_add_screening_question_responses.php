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
        Schema::create('screening_question_responses', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('pool_candidate_id');
            $table->foreign("pool_candidate_id")->references("id")->on("pool_candidates");
            $table->string('answer');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('screening_question_screening_question_response', function (Blueprint $table) {
            $table->uuid('question_id');
            $table->foreign('question_id')->references('id')->on('screening_questions')->onUpdate('cascade')->onDelete('cascade');
            $table->uuid('question_response_id');
            $table->foreign('question_response_id')->references('id')->on('screening_question_responses')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screening_question_screening_question_response');
        Schema::dropIfExists('screening_question_responses');
    }
};
