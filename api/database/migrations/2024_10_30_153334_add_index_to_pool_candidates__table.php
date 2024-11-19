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
            $table->index(['submitted_at', 'user_id'], 'submitted_at_user_id_index');
            $table->index('status_weight', 'status_weight_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropIndex('submitted_at_user_id_index');
            $table->dropIndex('status_weight_index');
        });
    }
};
