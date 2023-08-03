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
        Schema::table('classification_pool', function (Blueprint $table) {
            $table->dropForeign('classification_pool_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete(true);
        });
        Schema::table('pools_nonessential_skills', function (Blueprint $table) {
            $table->dropForeign('pools_nonessential_skills_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete(true);
        });
        Schema::table('pools_essential_skills', function (Blueprint $table) {
            $table->dropForeign('pools_essential_skills_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete(true);
        });
        Schema::table('screening_questions', function (Blueprint $table) {
            $table->dropForeign('screening_questions_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete(true);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classification_pool', function (Blueprint $table) {
            $table->dropForeign('classification_pool_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('pools_nonessential_skills', function (Blueprint $table) {
            $table->dropForeign('pools_nonessential_skills_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('pools_essential_skills', function (Blueprint $table) {
            $table->dropForeign('pools_essential_skills_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('screening_questions', function (Blueprint $table) {
            $table->dropForeign('screening_questions_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
    }
};
