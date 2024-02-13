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
        Schema::table('general_questions', function (Blueprint $table) {
            $table->dropForeign('general_questions_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools')->cascadeOnDelete(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('general_questions', function (Blueprint $table) {
            $table->dropForeign('general_questions_pool_id_foreign');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
    }
};
