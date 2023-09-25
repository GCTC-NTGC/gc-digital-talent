<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
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
        // create the combined table
        Schema::create('pool_skill', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('skill_id');
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->uuid('pool_id');
            $table->foreign('pool_id')->references('id')->on('pools');
            $table->unique(['skill_id', 'pool_id']);
            $table->timestamps();
            $table->string('type');
        });

        // fill the new table with pool-skill rows using the prior two tables
        $essentialPoolSkills = DB::table('pools_essential_skills')->get();
        $arrayEssentialSkillsToInsert = [];
        foreach ($essentialPoolSkills as $instance) {
            array_push($arrayEssentialSkillsToInsert,
                [
                    'skill_id' => $instance->skill_id,
                    'pool_id' => $instance->pool_id,
                    'type' => 'ESSENTIAL',
                ]
            );
        }
        DB::table('pool_skill')->insert($arrayEssentialSkillsToInsert);
        $nonessentialPoolSkills = DB::table('pools_nonessential_skills')->get();
        // must not have duplication, pool-skill combo as essential as well as nonessential
        $filteredNonessential = $nonessentialPoolSkills->reject(function ($value) use ($essentialPoolSkills) {
            foreach ($essentialPoolSkills as $instance) {
                if (
                    $value->skill_id === $instance->skill_id &&
                    $value->pool_id === $instance->pool_id
                ) {
                    return true;
                }
            }
        });
        $arrayNonessentialSkillsToInsert = [];
        foreach ($filteredNonessential as $instance) {
            array_push($arrayNonessentialSkillsToInsert,
                [
                    'skill_id' => $instance->skill_id,
                    'pool_id' => $instance->pool_id,
                    'type' => 'NONESSENTIAL',
                ]
            );
        }
        DB::table('pool_skill')->insert($arrayNonessentialSkillsToInsert);

        // drop the two tables
        Schema::dropIfExists('pools_essential_skills');
        Schema::dropIfExists('pools_nonessential_skills');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // create again the two tables that were removed
        Schema::create('pools_essential_skills', function (Blueprint $table) {
            $table->uuid('skill_id')->nullable();
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->uuid('pool_id')->nullable();
            $table->foreign('pool_id')->references('id')->on('pools');
            $table->unique(['skill_id', 'pool_id']);
            $table->timestamps();
        });
        Schema::create('pools_nonessential_skills', function (Blueprint $table) {
            $table->uuid('skill_id')->nullable();
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->uuid('pool_id')->nullable();
            $table->foreign('pool_id')->references('id')->on('pools');
            $table->unique(['skill_id', 'pool_id']);
            $table->timestamps();
        });

        // fill the two tables using the combined one
        $essentialPoolSkills = DB::table('pool_skill')->where('type', 'ESSENTIAL')->get();
        $arrayEssentialSkillsToInsert = [];
        foreach ($essentialPoolSkills as $instance) {
            array_push($arrayEssentialSkillsToInsert,
                [
                    'skill_id' => $instance->skill_id,
                    'pool_id' => $instance->pool_id,
                ]
            );
        }
        DB::table('pools_essential_skills')->insert($arrayEssentialSkillsToInsert);
        $nonessentialPoolSkills = DB::table('pool_skill')->where('type', 'NONESSENTIAL')->get();
        $arrayNonessentialSkillsToInsert = [];
        foreach ($nonessentialPoolSkills as $instance) {
            array_push($arrayNonessentialSkillsToInsert,
                [
                    'skill_id' => $instance->skill_id,
                    'pool_id' => $instance->pool_id,
                ]
            );
        }
        DB::table('pools_nonessential_skills')->insert($arrayNonessentialSkillsToInsert);
        // drop the combined table
        Schema::dropIfExists('pool_skill');
    }
};
