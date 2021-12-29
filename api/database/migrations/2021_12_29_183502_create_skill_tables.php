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
        Schema::create('skill_category_groups', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->string('key')->nullable(false)->unique();
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE skill_category_groups ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('skill_categories', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->string('key')->nullable(false)->unique();
            $table->uuid('skill_category_group_id')->nullable(false);
            $table->foreign('skill_category_group_id')->references('id')->on('skill_category_groups');
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE skill_categories ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('skills', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->string('key')->nullable(false)->unique();
            $table->jsonb('description')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->uuid('skill_category_id')->nullable(false);
            $table->foreign('skill_category_id')->references('id')->on('skill_categories');
            $table->timestamps();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE skills ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('skills');
        Schema::dropIfExists('skill_categories');
        Schema::dropIfExists('skill_category_groups');
    }
}
