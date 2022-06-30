<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdatePoolCandidateFilterToSearchApplicants extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidate_filters', function (Blueprint $table) {
            $table->boolean('would_accept_temporary')->nullable(true);
        });

        Schema::create( 'pool_candidate_filter_skill', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters')->nullable(false);
            $table->uuid('skill_id')->references('id')->on('skills')->nullable(false);
            $table->unique(['pool_candidate_filter_id', 'skill_id'], 'pool_candidate_filter_skill_unique');
        });
        DB::statement('ALTER TABLE pool_candidate_filter_skill ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pool_candidate_filters', function (Blueprint $table) {
            $table->dropColumn('would_accept_temporary');
        });
        Schema::dropIfExists('pool_candidate_filter_skill');
    }
}
