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
            $table->string('role')->nullable(false);
            $table->string('organization')->nullable();
            $table->string('division')->nullable();
            $table->date('start_date')->nullable(false);
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
        });
        DB::statement('ALTER TABLE work_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('personal_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->string('title')->nullable(false);
            $table->text('description')->nullable();
            $table->date('start_date')->nullable(false);
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
        });
        DB::statement('ALTER TABLE personal_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('community_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->string('title')->nullable(false);
            $table->string('organization')->nullable();
            $table->string('project')->nullable();
            $table->date('start_date')->nullable(false);
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
        });
        DB::statement('ALTER TABLE community_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('education_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->string('institution')->nullable(false);
            $table->string('area_of_study')->nullable(false);
            $table->string('thesis_title')->nullable();
            $table->date('start_date')->nullable(false);
            $table->date('end_date')->nullable();
            $table->string('type')->nullable(false);
            $table->string('status')->nullable(false);
            $table->timestamps();
        });
        DB::statement('ALTER TABLE education_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('award_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->string('title')->nullable(false);
            $table->string('issued_by')->nullable(false);
            $table->date('awarded_date')->nullable(false);
            $table->string('recipient_type')->nullable(false);
            $table->string('recognition_type')->nullable(false);
            $table->timestamps();
        });
        DB::statement('ALTER TABLE award_experiences ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('experiences', function (Blueprint $table) {
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->uuid('experience_id');
            $table->string('experience_type');
        });
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
        Schema::dropIfExists('experiences');
    }
}
