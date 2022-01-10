<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateSkillTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('skill_families', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->string('key')->nullable(false)->unique();
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('description')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->string('category')->nullable(false);
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE skill_families ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('skills', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->string('key')->nullable(false)->unique();
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('description')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('keywords')->nullable(true);
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE skills ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('skill_skill_family', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->uuid('skill_id');
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->uuid('skill_family_id');
            $table->foreign('skill_family_id')->references('id')->on('skill_families');
        });
        DB::statement('ALTER TABLE skill_skill_family ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('skill_skill_family');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('skill_families');
    }
}
