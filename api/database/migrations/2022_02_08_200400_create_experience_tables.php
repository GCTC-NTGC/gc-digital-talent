<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExperienceTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('role')->nullable();
            $table->string('organization')->nullable();
            $table->string('division')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE work_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('personal_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE personal_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('community_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('title')->nullable();
            $table->string('organization')->nullable();
            $table->string('project')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE community_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('education_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('institution')->nullable();
            $table->string('area_of_study')->nullable();
            $table->string('thesis_title')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('type')->nullable();
            $table->string('status')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE education_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('award_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('title')->nullable();
            $table->string('issued_by')->nullable();
            $table->date('awarded_date')->nullable();
            $table->string('awarded_to')->nullable();
            $table->string('awarded_scope')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE award_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('experience_skills', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->text('details')->nullable();
            $table->uuid('skill_id')->nullable(false);
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->uuid('experience_id')->nullable(false);
            $table->string('experience_type')->nullable(false);
            $table->unique(['skill_id', 'experience_id']);
            $table->timestamps();
        });
        DB::statement('ALTER TABLE experience_skills ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('work_experiences');
        Schema::dropIfExists('personal_experiences');
        Schema::dropIfExists('community_experiences');
        Schema::dropIfExists('education_experiences');
        Schema::dropIfExists('award_experiences');
    }
}
