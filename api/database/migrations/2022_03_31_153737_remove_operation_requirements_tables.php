<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveOperationRequirementsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('operational_requirement_pool');
        Schema::dropIfExists('operational_requirement_pool_candidate');
        Schema::dropIfExists('operational_requirement_pool_candidate_filter');
        Schema::dropIfExists('operational_requirement_user');
        Schema::dropIfExists('operational_requirements');

        Schema::table('users', function (Blueprint $table) {
            $table->jsonb('accepted_operational_requirements')->nullable(true);
        });
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->jsonb('accepted_operational_requirements')->nullable(true);
        });
        Schema::table('pools', function (Blueprint $table) {
            $table->jsonb('operational_requirements')->nullable(true);
        });
        Schema::table('pool_candidate_filters', function (Blueprint $table) {
            $table->jsonb('operational_requirements')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pool_candidate_filters', function (Blueprint $table) {
            $table->dropColumn('operational_requirements')->nullable(true);
        });
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('operational_requirements');
        });
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('accepted_operational_requirements');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('accepted_operational_requirements');
        });


        // 2021_05_27_182844_create_operational_requirements_table.php
        Schema::create('operational_requirements', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->string('key')->nullable(false);
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('description')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
        });
        DB::statement('ALTER TABLE operational_requirements ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        // 2021_05_28_200606_create_pool_lookup_pivot_tables.php
        Schema::create('operational_requirement_pool', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('operational_requirement_id')->references('id')->on('operational_requirements');
            $table->uuid('pool_id')->references('id')->on('pools');
        });
        DB::statement('ALTER TABLE operational_requirement_pool ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        // 2021_06_01_140524_create_pool_candidates_table.php
        Schema::create('operational_requirement_pool_candidate', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_id')->references('id')->on('pool_candidates')->nullable(false);
            $table->uuid('operational_requirement_id')->references('id')->on('operational_requirements')->nullable(false);
        });
        DB::statement('ALTER TABLE operational_requirement_pool_candidate ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        // 2021_06_21_205655_update_operational_requirements_table_soft_deletes.php
        Schema::table('operational_requirements', function (Blueprint $table) {
            $table->softDeletes();
        });

        // 2021_09_17_190139_create_pool_candidate_filters_table.php
        Schema::create('operational_requirement_pool_candidate_filter', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters')->nullable(false);
            $table->uuid('operational_requirement_id')->references('id')->on('operational_requirements')->nullable(false);
        });
        DB::statement('ALTER TABLE operational_requirement_pool_candidate_filter ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        // 2021_11_09_145430_add_constraints.php
        Schema::table('operational_requirements', function (Blueprint $table) {
            $table->unique('key');
        });
        Schema::table('operational_requirement_pool_candidate_filter', function (Blueprint $table) {
            $table->foreign('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters');
            $table->foreign('operational_requirement_id')->references('id')->on('operational_requirements');
        });
        Schema::table('operational_requirement_pool_candidate', function (Blueprint $table) {
            $table->foreign('pool_candidate_id')->references('id')->on('pool_candidates');
            $table->foreign('operational_requirement_id')->references('id')->on('operational_requirements');
        });
        Schema::table('operational_requirement_pool', function (Blueprint $table) {
            $table->foreign('operational_requirement_id')->references('id')->on('operational_requirements');
            $table->foreign('pool_id')->references('id')->on('pools');
        });

        // 2022_03_03_231414_update_users_table_with_profile_data.php
        Schema::create('operational_requirement_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('user_id')->references('id')->on('users')->nullable(false);
            $table->uuid('operational_requirement_id')->references('id')->on('operational_requirements')->nullable(false);
        });
        DB::statement('ALTER TABLE operational_requirement_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');

    }
}
