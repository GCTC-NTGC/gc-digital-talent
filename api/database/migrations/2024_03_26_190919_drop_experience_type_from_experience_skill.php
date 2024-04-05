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
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->dropColumn('experience_type');
        });
        Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
            $table->dropColumn('experience_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $morphCaseStatement = <<<'SQL'
            case e.experience_type
                when 'App\Models\AwardExperience' then 'awardExperience'
                when 'App\Models\CommunityExperience' then 'communityExperience'
                when 'App\Models\EducationExperience' then 'educationExperience'
                when 'App\Models\PersonalExperience' then 'personalExperience'
                when 'App\Models\WorkExperience' then 'workExperience'
            end
        SQL;

        // make new column nullable
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->string('experience_type')->nullable();
        });

        // fill the column
        DB::statement("
            UPDATE experience_skill as t
            SET experience_type = $morphCaseStatement
            FROM experiences AS e
            WHERE t.experience_id  = e.id
        ");

        // make new column not nullable
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->string('experience_type')
                ->nullable(false)
                ->change();
        });

        Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
            $table->string('experience_type')->nullable();
        });

        DB::statement("
            UPDATE pool_candidate_education_requirement_experience as t
            SET experience_type = $morphCaseStatement
            FROM experiences AS e
            WHERE t.experience_id  = e.id
        ");

        Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
            $table->string('experience_type')
                ->nullable(false)
                ->change();
        });

    }
};
