<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applicant_filter_classification', function (Blueprint $table) {
            $table->foreign('applicant_filter_id')->references('id')->on('applicant_filters')->cascadeOnDelete(true);
            $table->foreign('classification_id')->references('id')->on('classifications')->cascadeOnDelete(true);
        });

        Schema::table('applicant_filter_pool', function (Blueprint $table) {
            $table->foreign('applicant_filter_id')->references('id')->on('applicant_filters')->cascadeOnDelete(true);
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete(true);
        });

        Schema::table('applicant_filter_qualified_classification', function (Blueprint $table) {
            $table->foreign('applicant_filter_id')->references('id')->on('applicant_filters')->cascadeOnDelete(true);
            $table->foreign('classification_id')->references('id')->on('classifications')->cascadeOnDelete(true);
        });

        Schema::table('applicant_filter_skill', function (Blueprint $table) {
            $table->foreign('applicant_filter_id')->references('id')->on('applicant_filters')->cascadeOnDelete(true);
            $table->foreign('skill_id')->references('id')->on('skills')->cascadeOnDelete(true);
        });

        Schema::table('classification_user', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->foreign('classification_id')->references('id')->on('classifications')->cascadeOnDelete(true);
        });

        Schema::table('generic_job_title_user', function (Blueprint $table) {
            $table->foreign('generic_job_title_id')->references('id')->on('generic_job_titles')->cascadeOnDelete(true);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });

        Schema::table('generic_job_titles', function (Blueprint $table) {
            $table->foreign('classification_id')->references('id')->on('classifications')->cascadeOnDelete(true);
        });

        Schema::table('permission_user', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->foreign('team_id')->references('id')->on('teams')->cascadeOnDelete(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicant_filter_classification', function (Blueprint $table) {
            $table->dropForeign('applicant_filter_classification_applicant_filter_id_foreign');
            $table->dropForeign('applicant_filter_classification_classification_id_foreign');
        });

        Schema::table('applicant_filter_pool', function (Blueprint $table) {
            $table->dropForeign('applicant_filter_pool_applicant_filter_id_foreign');
            $table->dropForeign('applicant_filter_pool_pool_id_foreign');
        });

        Schema::table('applicant_filter_qualified_classification', function (Blueprint $table) {
            $table->dropForeign('applicant_filter_qualified_classification_applicant_filter_id_foreign');
            $table->dropForeign('applicant_filter_qualified_classification_classification_id_foreign');
        });

        Schema::table('applicant_filter_skill', function (Blueprint $table) {
            $table->dropForeign('applicant_filter_skill_applicant_filter_id_foreign');
            $table->dropForeign('applicant_filter_skill_skill_id_foreign');
        });

        Schema::table('classification_user', function (Blueprint $table) {
            $table->dropForeign('classification_user_user_id_foreign');
            $table->dropForeign('classification_user_classification_id_foreign');
        });

        Schema::table('generic_job_title_user', function (Blueprint $table) {
            $table->dropForeign('generic_job_title_user_generic_job_title_id_foreign');
            $table->dropForeign('generic_job_title_user_user_id_foreign');
        });

        Schema::table('generic_job_titles', function (Blueprint $table) {
            $table->dropForeign('generic_job_titles_classification_id_foreign');
        });

        Schema::table('permission_user', function (Blueprint $table) {
            $table->dropForeign('permission_user_user_id_foreign');
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->dropForeign('pools_team_id_foreign');
        });
    }
};
