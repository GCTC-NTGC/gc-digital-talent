<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('education_experiences', function (Blueprint $table) {
            $table->string('education_type')->nullable();
            $table->string('other_education_type')->nullable();
            $table->string('degree_type')->nullable();
            $table->string('license_or_accreditation')->nullable();
            $table->string('certification')->nullable();
            $table->string('course_name')->nullable();
            $table->string('fellowship_type')->nullable();
            $table->string('other_fellowship_type')->nullable();
            $table->date('prospective_end_date')->nullable();
        });

        DB::statement(<<<'SQL'
            UPDATE education_experiences
            SET education_type = CASE type
                WHEN 'DIPLOMA' THEN 'DEGREE_DIPLOMA_CERTIFICATE'
                WHEN 'BACHELORS_DEGREE' THEN 'DEGREE_DIPLOMA_CERTIFICATE'
                WHEN 'MASTERS_DEGREE' THEN 'DEGREE_DIPLOMA_CERTIFICATE'
                WHEN 'PHD' THEN 'DEGREE_DIPLOMA_CERTIFICATE'
                WHEN 'POST_DOCTORAL_FELLOWSHIP' THEN 'FELLOWSHIP'
                WHEN 'ONLINE_COURSE' THEN 'INDIVIDUAL_COURSE'
                WHEN 'CERTIFICATION' THEN 'PROFESSIONAL_CERTIFICATION'
                WHEN 'OTHER' THEN 'OTHER'
                ELSE 'OTHER'
            END
        SQL);

        DB::statement(<<<'SQL'
            UPDATE education_experiences
            SET degree_type = CASE type
                WHEN 'DIPLOMA' THEN 'COLLEGE_DIPLOMA'
                WHEN 'BACHELORS_DEGREE' THEN 'BACHELORS_DEGREE'
                WHEN 'MASTERS_DEGREE' THEN 'MASTERS_DEGREE'
                WHEN 'PHD' THEN 'PHD'
                ELSE null
            END
        SQL);

        DB::statement(<<<'SQL'
            UPDATE education_experiences
            SET fellowship_type = 'POST_DOCTORAL'
            WHERE type = 'POST_DOCTORAL_FELLOWSHIP'
        SQL);

        DB::statement(<<<'SQL'
            UPDATE education_experiences
            SET certification = area_of_study
            WHERE type = 'CERTIFICATION'
        SQL);

        Schema::table('education_experiences', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('education_experiences', function (Blueprint $table) {
            $table->string('type')->nullable();
        });

        DB::statement(<<<'SQL'
            UPDATE education_experiences
            SET type = CASE education_type
                WHEN 'DEGREE_DIPLOMA_CERTIFICATE' THEN CASE degree_type
                    WHEN 'COLLEGE_DIPLOMA' THEN 'DIPLOMA'
                    WHEN 'BACHELORS_DEGREE' THEN 'BACHELORS_DEGREE'
                    WHEN 'MASTERS_DEGREE' THEN 'MASTERS_DEGREE'
                    WHEN 'PHD' THEN 'PHD'
                    ELSE 'OTHER'
                END
                WHEN 'FELLOWSHIP' THEN CASE fellowship_type
                    WHEN 'POST_DOCTORAL' THEN 'POST_DOCTORAL_FELLOWSHIP'
                    ELSE 'OTHER'
                END
                WHEN 'INDIVIDUAL_COURSE' THEN 'ONLINE_COURSE'
                WHEN 'PROFESSIONAL_CERTIFICATION' THEN 'CERTIFICATION'
                WHEN 'OTHER' THEN 'OTHER'
                ELSE 'OTHER'
            END
        SQL);

        // Delete new fields
        Schema::table('education_experiences', function (Blueprint $table) {
            $table->dropColumn('education_type');
            $table->dropColumn('other_education_type');
            $table->dropColumn('degree_type');
            $table->dropColumn('license_or_accreditation');
            $table->dropColumn('certification');
            $table->dropColumn('course_name');
            $table->dropColumn('fellowship_type');
            $table->dropColumn('other_fellowship_type');
            $table->dropColumn('prospective_end_date');
        });
    }
};
