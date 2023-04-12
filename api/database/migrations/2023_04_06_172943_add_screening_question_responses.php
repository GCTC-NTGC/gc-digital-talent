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
            $table->foreign("pool_candidate_id")->references("id")->on("pool_candidates")
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->uuid('screening_question_id');
            $table->foreign("screening_question_id")->references("id")->on("screening_questions")
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
    }
};
