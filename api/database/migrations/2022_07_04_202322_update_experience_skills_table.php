<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateExperienceSkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('experience_skills', function (Blueprint $table) {
            $table->dropPrimary('id');
            $table->dropForeign(['skill_id']);
            $table->dropUnique('experience_skills_unique');
            $table->dropUnique('experience_skills_skill_id_experience_id_experience_type_unique');

        });
        Schema::rename('experience_skills', 'experience_skill');
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->primary('id');
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->unique(['skill_id', 'experience_id'], 'experience_skill_unique');
            $table->unique(['skill_id', 'experience_id', 'experience_type'], 'experience_skill_skill_id_experience_id_experience_type_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->dropPrimary('id');
            $table->dropForeign(['skill_id']);
            $table->dropUnique('experience_skill_unique');
            $table->dropUnique('experience_skill_skill_id_experience_id_experience_type_unique');
        });
        Schema::rename('experience_skill', 'experience_skills');
        Schema::table('experience_skills', function (Blueprint $table) {
            $table->primary('id');
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->unique(['skill_id', 'experience_id'], 'experience_skills_unique');
            $table->unique(['skill_id', 'experience_id', 'experience_type'], 'experience_skills_skill_id_experience_id_experience_type_unique');
        });
    }
}
