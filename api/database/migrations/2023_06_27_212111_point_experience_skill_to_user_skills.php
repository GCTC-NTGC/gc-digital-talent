<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    /**
     * Ensure that a single UserSkill record exists for each unique User->Experience->Skill relation for a given experience type.
     *
     * @param [type] $experienceTable
     * @return void
     */
    public function createUserSkillRecordsForExistingExperiences($experienceTable)
    {
        DB::statement("WITH distinct_experience_skills AS (
                SELECT DISTINCT user_id, skill_id
                FROM experience_skill
                    LEFT JOIN $experienceTable as experience ON experience.id = experience_id
                WHERE user_id IS NOT null
                    AND skill_id IS NOT null
            )
            INSERT INTO user_skills (user_id, skill_id, created_at, updated_at)
            SELECT user_id, skill_id, now(), now() FROM distinct_experience_skills
            ON CONFLICT ON CONSTRAINT user_skills_user_id_skill_id_unique
                DO NOTHING");
    }

    /**
     * Update each experience_skill entry for a particular experience type to have it point to the correct UserSkill record.
     * This assumes an appropriate UserSkill record already exists.
     *
     * @param [type] $experienceTable
     * @return void
     */
    public function updateExperienceSkillTable($experienceTable)
    {
        DB::statement("UPDATE experience_skill
            SET user_skill_id = subquery.user_skill_id
            FROM (
                SELECT user_skills.id AS user_skill_id, experience_skill.id AS experience_skill_id
                FROM experience_skill
                INNER JOIN $experienceTable ON experience_skill.experience_id = $experienceTable.id
                INNER JOIN user_skills ON $experienceTable.user_id = user_skills.user_id
                    AND experience_skill.skill_id = user_skills.skill_id
            ) as subquery
            WHERE experience_skill.id = subquery.experience_skill_id");
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->uuid('user_skill_id')->nullable(true); // Nullable is temporary
            $table->foreign('user_skill_id')->references('id')->on('user_skills')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        $experienceTables = [
            'award_experiences',
            'community_experiences',
            'education_experiences',
            'personal_experiences',
            'work_experiences'
        ];

        foreach ($experienceTables as $experienceTable) {
            // Create any necessary UserSkill records that don't exist yet.
            print_r($this->createUserSkillRecordsForExistingExperiences($experienceTable));
            // Now link each Experience to the correct UserSkill.
            print_r($this->updateExperienceSkillTable($experienceTable));
        }

        Schema::table('experience_skill', function (Blueprint $table) {
            // Now that all experience-skill entries have been updated, make nullable false
            $table->uuid('user_skill_id')->nullable(false)->change();
            // Drop old uniqueness constraints based on skill_id, and replace with one based on user_skill_id
            $table->dropUnique('experience_skill_unique');
            $table->dropUnique('experience_skill_skill_id_experience_id_experience_type_unique');
            $table->unique(['user_skill_id', 'experience_id'], 'experience_user_skill_unique');

            // And remove the direct link to the skills table
            $table->dropColumn('skill_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add skill_id
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->uuid('skill_id')->nullable(true); // Nullable is temporary
        });

        // Restore skill_id value
        DB::raw("UPDATE experience_skill
            SET skill_id = user_skills.skill_id
            FROM user_skills
            WHERE experience_skill.user_skill_id = user_skills.id");

        // Now clean up table
        Schema::table('experience_skill', function (Blueprint $table) {
            // Drop user_skill_id and related constraints
            $table->dropUnique('experience_user_skill_unique');
            $table->dropForeign(['user_skill_id']);
            $table->dropColumn('user_skill_id');

            // Re-add foreign and uniqueness constraints
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->unique(['skill_id', 'experience_id'], 'experience_skill_unique');
            $table->unique(['skill_id', 'experience_id', 'experience_type'], 'experience_skill_skill_id_experience_id_experience_type_unique');
        });
    }
};
