<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExperienceSkillTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
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
        Schema::dropIfExists('experience_skills');
    }
}
