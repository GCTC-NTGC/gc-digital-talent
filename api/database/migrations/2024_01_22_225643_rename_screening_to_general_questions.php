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
        Schema::rename('screening_questions', 'general_questions');
        Schema::rename('screening_question_responses', 'general_question_responses');

        Schema::table('general_question_responses', function (Blueprint $table) {
            $table->renameColumn('screening_question_id', 'general_question_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('general_questions', 'screening_questions');
        Schema::rename('general_question_responses', 'screening_question_responses');

        Schema::table('screening_question_responses', function (Blueprint $table) {
            $table->renameColumn('general_question_id', 'screening_question_id');
        });
    }
};
