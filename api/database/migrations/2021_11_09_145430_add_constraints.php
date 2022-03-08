<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConstraints extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
        });
        Schema::table('pools', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('pool_pool_candidate_filter', function (Blueprint $table) {
            $table->foreign('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->foreign('pool_id')->references('id')->on('pools');
            $table->foreign('user_id')->references('id')->on('users');
        });

        #start of pool_candidate_search_requests.department_id type migration
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->uuid("department_id_as_uuid")->nullable(true)->after('department_id');
        });
        DB::statement('UPDATE pool_candidate_search_requests SET department_id_as_uuid = uuid(department_id)');
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->uuid("department_id_as_uuid")->nullable(false)->change();
            $table->dropColumn('department_id');
            $table->renameColumn('department_id_as_uuid', 'department_id');
        });
        #end of pool_candidate_search_requests.department_id type migration

        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->foreign('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters');
            $table->foreign("department_id")->references('id')->on('departments');
        });
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
        Schema::table('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->foreign('cmo_asset_id')->references('id')->on('cmo_assets');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('cmo_assets', function (Blueprint $table) {
            $table->unique('key');
        });
        Schema::table('cmo_asset_pool_candidate_filter', function (Blueprint $table) {
            $table->foreign('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters');
            $table->foreign('cmo_asset_id')->references('id')->on('cmo_assets');
        });
        Schema::table('cmo_asset_pool_candidate', function (Blueprint $table) {
            $table->foreign('pool_candidate_id')->references('id')->on('pool_candidates');
            $table->foreign('cmo_asset_id')->references('id')->on('cmo_assets');
        });
        Schema::table('classification_pool_candidate_filter', function (Blueprint $table) {
            $table->foreign('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters');
            $table->foreign('classification_id')->references('id')->on('classifications');
        });
        Schema::table('classification_pool_candidate', function (Blueprint $table) {
            $table->foreign('pool_candidate_id')->references('id')->on('pool_candidates');
            $table->foreign('classification_id')->references('id')->on('classifications');
        });
        Schema::table('classification_pool', function (Blueprint $table) {
            $table->foreign('classification_id')->references('id')->on('classifications');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->foreign('cmo_asset_id')->references('id')->on('cmo_assets');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_email_unique');
        });
        Schema::table('pools', function (Blueprint $table) {
            $table->dropForeign('pools_user_id_foreign');
        });
        Schema::table('pool_pool_candidate_filter', function (Blueprint $table) {
            $table->dropForeign('pool_pool_candidate_filter_pool_candidate_filter_id_foreign');
            $table->dropForeign('pool_pool_candidate_filter_pool_id_foreign');
        });
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropForeign('pool_candidates_pool_id_foreign');
            $table->dropForeign('pool_candidates_user_id_foreign');

        });
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropForeign('pool_candidate_search_requests_pool_candidate_filter_id_foreign');
            $table->dropForeign('pool_candidate_search_requests_department_id_foreign');
        });

        #start of pool_candidate_search_requests.department_id type migration
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->string('department_id_as_string')->nullable(true)->after('department_id');
        });
        DB::statement('UPDATE pool_candidate_search_requests SET department_id_as_string = department_id');
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->string("department_id_as_string")->nullable(false)->change();
            $table->dropColumn('department_id');
            $table->renameColumn('department_id_as_string', 'department_id');
        });
        #end of pool_candidate_search_requests.department_id type migration

        Schema::table('operational_requirements', function (Blueprint $table) {
            $table->dropUnique('operational_requirements_key_unique');
        });
        Schema::table('operational_requirement_pool_candidate_filter', function (Blueprint $table) {
            $table->dropForeign('operational_requirement_pool_candidate_filter_pool_candidate_filter_id_foreign');
            $table->dropForeign('operational_requirement_pool_candidate_filter_operational_requirement_id_foreign');
        });
        Schema::table('operational_requirement_pool_candidate', function (Blueprint $table) {
            $table->dropForeign('operational_requirement_pool_candidate_pool_candidate_id_foreign');
            $table->dropForeign('operational_requirement_pool_candidate_operational_requirement_id_foreign');
        });
        Schema::table('operational_requirement_pool', function (Blueprint $table) {
            $table->dropForeign('operational_requirement_pool_operational_requirement_id_foreign');
            $table->dropForeign('operational_requirement_pool_pool_id_foreign');
        });
        Schema::table('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->dropForeign('essential_cmo_asset_pool_cmo_asset_id_foreign');
            $table->dropForeign('essential_cmo_asset_pool_pool_id_foreign');
        });
        Schema::table('cmo_assets', function (Blueprint $table) {
            $table->dropUnique('cmo_assets_key_unique');
        });
        Schema::table('cmo_asset_pool_candidate_filter', function (Blueprint $table) {
            $table->dropForeign('cmo_asset_pool_candidate_filter_pool_candidate_filter_id_foreign');
            $table->dropForeign('cmo_asset_pool_candidate_filter_cmo_asset_id_foreign');
        });
        Schema::table('cmo_asset_pool_candidate', function (Blueprint $table) {
            $table->dropForeign('cmo_asset_pool_candidate_pool_candidate_id_foreign');
            $table->dropForeign('cmo_asset_pool_candidate_cmo_asset_id_foreign');
        });
        Schema::table('classification_pool_candidate_filter', function (Blueprint $table) {
            $table->dropForeign('classification_pool_candidate_filter_pool_candidate_filter_id_foreign');
            $table->dropForeign('classification_pool_candidate_filter_classification_id_foreign');
        });
        Schema::table('classification_pool_candidate', function (Blueprint $table) {
            $table->dropForeign('classification_pool_candidate_pool_candidate_id_foreign');
            $table->dropForeign('classification_pool_candidate_classification_id_foreign');
        });
        Schema::table('classification_pool', function (Blueprint $table) {
            $table->dropForeign('classification_pool_classification_id_foreign');
            $table->dropForeign('classification_pool_pool_id_foreign');
        });
        Schema::table('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->dropForeign('asset_cmo_asset_pool_cmo_asset_id_foreign');
            $table->dropForeign('asset_cmo_asset_pool_pool_id_foreign');
        });
    }
}

