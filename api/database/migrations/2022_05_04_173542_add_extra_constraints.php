<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExtraConstraints extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /** the first batch is a bunch of pivots to make unique **/

        // a pool may not have duplicate CMO assets assigned to it
        Schema::table('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->unique(['cmo_asset_id', 'pool_id'], 'asset_cmo_asset_pool_unique');
        });

        // a pool may not have duplicate classifications assigned to it
        Schema::table('classification_pool', function (Blueprint $table) {
            $table->unique(['classification_id', 'pool_id'], 'classification_pool_unique');
        });

        // a pool candidate may not have duplicate classifications assigned to it
        Schema::table('classification_pool_candidate', function (Blueprint $table) {
            $table->unique(['pool_candidate_id', 'classification_id'], 'classification_pool_candidate_unique');
        });

        // a user may not have duplicate classifications assigned to it
        Schema::table('classification_user', function (Blueprint $table) {
            $table->unique(['user_id', 'classification_id'], 'classification_user_unique');
        });

        // a pool candidate may not have duplicate CMO assets assigned to it
        Schema::table('cmo_asset_pool_candidate', function (Blueprint $table) {
            $table->unique(['pool_candidate_id', 'cmo_asset_id'], 'cmo_asset_pool_candidate_unique');
        });

        // a user may not have duplicate CMO assets assigned to it
        Schema::table('cmo_asset_user', function (Blueprint $table) {
            $table->unique(['user_id', 'cmo_asset_id'], 'cmo_asset_user_unique');
        });

        // a pool may not have duplicate CMO assets assigned to it
        Schema::table('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->unique(['cmo_asset_id', 'pool_id'], 'essential_cmo_asset_pool_unique');
        });

        // an experience may not have duplicate skills assigned to it
        Schema::table('experience_skills', function (Blueprint $table) {
            $table->unique(['skill_id', 'experience_id'], 'experience_skills_unique');
        });

        // a user can only have one pool candidate in a pool at a time
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->unique(['pool_id', 'user_id'], 'pool_candidates_pool_user_unique');
        });

        // a skill family may not have duplicate skills assigned to it
        Schema::table('skill_skill_family', function (Blueprint $table) {
            $table->unique(['skill_id', 'skill_family_id'], 'skill_skill_family_unique');
        });

        /** the first batch is a bunch of pivots to make unique **/
        Schema::table('users', function (Blueprint $table) {
            $table->unique('sub');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->dropUnique('asset_cmo_asset_pool_unique');
        });

        Schema::table('classification_pool', function (Blueprint $table) {
            $table->dropUnique('classification_pool_unique');
        });

        Schema::table('classification_pool_candidate', function (Blueprint $table) {
            $table->dropUnique('classification_pool_candidate_unique');
        });

        Schema::table('classification_user', function (Blueprint $table) {
            $table->dropUnique('classification_user_unique');
        });

        Schema::table('cmo_asset_pool_candidate', function (Blueprint $table) {
            $table->dropUnique('cmo_asset_pool_candidate_unique');
        });

        Schema::table('cmo_asset_user', function (Blueprint $table) {
            $table->dropUnique('cmo_asset_user_unique');
        });

        Schema::table('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->dropUnique('essential_cmo_asset_pool_unique');
        });

        Schema::table('experience_skills', function (Blueprint $table) {
            $table->dropUnique('experience_skills_unique');
        });

        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropUnique('pool_candidates_pool_user_unique');
        });

        Schema::table('skill_skill_family', function (Blueprint $table) {
            $table->dropUnique('skill_skill_family_unique');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_sub_unique');
        });
    }
}
