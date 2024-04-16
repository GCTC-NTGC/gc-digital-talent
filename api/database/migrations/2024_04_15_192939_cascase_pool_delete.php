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
        Schema::table('screening_questions', function (Blueprint $table) {
            // drop and recreate the index with cascade on delete
            $table->dropForeign('screening_questions_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('screening_questions', function (Blueprint $table) {
            // drop and recreate the index without cascade on delete
            $table->dropForeign('screening_questions_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
    }
};
