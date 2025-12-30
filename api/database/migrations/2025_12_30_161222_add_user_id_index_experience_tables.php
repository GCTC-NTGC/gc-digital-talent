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
        Schema::table('award_experiences', function (Blueprint $table) {
            $table->index('user_id', 'award_experiences_user_id_index');
        });

        Schema::table('community_experiences', function (Blueprint $table) {
            $table->index('user_id', 'community_experiences_user_id_index');
        });

        Schema::table('education_experiences', function (Blueprint $table) {
            $table->index('user_id', 'education_experiences_user_id_index');
        });

        Schema::table('personal_experiences', function (Blueprint $table) {
            $table->index('user_id', 'personal_experiences_user_id_index');
        });

        Schema::table('work_experiences', function (Blueprint $table) {
            $table->index('user_id', 'work_experiences_user_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('award_experiences', function (Blueprint $table) {
            $table->dropIndex('award_experiences_user_id_index');
        });

        Schema::table('community_experiences', function (Blueprint $table) {
            $table->dropIndex('community_experiences_user_id_index');
        });

        Schema::table('education_experiences', function (Blueprint $table) {
            $table->dropIndex('education_experiences_user_id_index');
        });

        Schema::table('personal_experiences', function (Blueprint $table) {
            $table->dropIndex('personal_experiences_user_id_index');
        });

        Schema::table('work_experiences', function (Blueprint $table) {
            $table->dropIndex('work_experiences_user_id_index');
        });
    }
};
