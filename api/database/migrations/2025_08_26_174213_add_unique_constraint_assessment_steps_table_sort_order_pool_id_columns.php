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
        Schema::table('assessment_steps', function (Blueprint $table) {
            $table->unique(['pool_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assessment_steps', function (Blueprint $table) {
            $table->dropUnique('assessment_steps_pool_id_sort_order_unique');
        });
    }
};
