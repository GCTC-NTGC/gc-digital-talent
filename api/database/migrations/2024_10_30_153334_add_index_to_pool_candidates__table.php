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
            $table->index(['submitted_at', 'user_id']);
            $table->index('status_weight');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropIndex(['submitted_at', 'user_id']);
            $table->dropIndex('status_weight');
        });
    }
};
