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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_official_language')->nullable()->default(null);
            $table->boolean('second_language_exam_completed')->nullable()->default(null);
            $table->boolean('second_language_exam_validity')->nullable()->default(null);
        });

        DB::statement("UPDATE users
                        SET first_official_language = 'fr',
                            second_language_exam_completed = true,
                            second_language_exam_validity = true
                        WHERE bilingual_evaluation = 'COMPLETED_ENGLISH'");

        DB::statement("UPDATE users
                        SET first_official_language = 'en',
                            second_language_exam_completed = true,
                            second_language_exam_validity = true
                        WHERE bilingual_evaluation = 'COMPLETED_FRENCH'");

        DB::statement("UPDATE users
                        SET first_official_language = null,
                            second_language_exam_completed = false,
                            second_language_exam_validity = false
                        WHERE bilingual_evaluation = 'NOT_COMPLETED'");

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('bilingual_evaluation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('bilingual_evaluation')->nullable();
        });

        DB::statement("UPDATE users
            SET bilingual_evaluation = 'COMPLETED_ENGLISH'
            WHERE first_official_language = 'fr' and
                  second_language_exam_completed = true and
                  second_language_exam_validity = true");

        DB::statement("UPDATE users
            SET bilingual_evaluation = 'COMPLETED_FRENCH'
            WHERE first_official_language = 'en' and
                  second_language_exam_completed = true and
                  second_language_exam_validity = true");

        DB::statement("UPDATE users
            SET bilingual_evaluation = 'NOT_COMPLETED'
            WHERE first_official_language = null or
                  second_language_exam_completed = false or
                  second_language_exam_validity = false");

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('first_official_language');
            $table->dropColumn('second_language_exam_completed');
            $table->dropColumn('second_language_exam_validity');
        });
    }
};
