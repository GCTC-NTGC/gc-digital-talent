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
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropForeign('pool_candidates_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });
        Schema::table('award_experiences', function (Blueprint $table) {
            $table->dropForeign('award_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });
        Schema::table('community_experiences', function (Blueprint $table) {
            $table->dropForeign('community_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });
        Schema::table('education_experiences', function (Blueprint $table) {
            $table->dropForeign('education_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });
        Schema::table('personal_experiences', function (Blueprint $table) {
            $table->dropForeign('personal_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });
        Schema::table('work_experiences', function (Blueprint $table) {
            $table->dropForeign('work_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });
        Schema::table('role_user', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropForeign('pool_candidates_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('award_experiences', function (Blueprint $table) {
            $table->dropForeign('award_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('community_experiences', function (Blueprint $table) {
            $table->dropForeign('community_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('education_experiences', function (Blueprint $table) {
            $table->dropForeign('education_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('personal_experiences', function (Blueprint $table) {
            $table->dropForeign('personal_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('work_experiences', function (Blueprint $table) {
            $table->dropForeign('work_experiences_user_id_foreign');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('role_user', function (Blueprint $table) {
            $table->dropForeign('role_user_user_id_foreign');
        });
    }
};
