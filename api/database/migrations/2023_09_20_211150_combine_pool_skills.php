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
        // create the combined table
        Schema::create('pool_skill', function (Blueprint $table) {
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
        foreach ($essentialPoolSkills as $instance) {
            DB::table('pool_skill')->insert([
                'skill_id' => $instance->skill_id,
                'pool_id' => $instance->pool_id,
                'type' => 'ESSENTIAL',
            ]);
        }
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
        foreach ($filteredNonessential as $instance) {
            DB::table('pool_skill')->insert([
                'skill_id' => $instance->skill_id,
                'pool_id' => $instance->pool_id,
                'type' => 'NONESSENTIAL',
            ]);
        }

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
        foreach ($essentialPoolSkills as $instance) {
            DB::table('pools_essential_skills')->insert([
                'skill_id' => $instance->skill_id,
                'pool_id' => $instance->pool_id,
            ]);
        }
        $nonessentialPoolSkills = DB::table('pool_skill')->where('type', 'NONESSENTIAL')->get();
        foreach ($nonessentialPoolSkills as $instance) {
            DB::table('pools_nonessential_skills')->insert([
                'skill_id' => $instance->skill_id,
                'pool_id' => $instance->pool_id,
            ]);
        }

        // drop the combined table
        Schema::dropIfExists('pool_skill');
    }
};
