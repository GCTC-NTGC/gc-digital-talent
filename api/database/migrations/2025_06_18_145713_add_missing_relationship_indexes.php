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
            $table->index('placed_department_id', 'idx_placed_department_id');
        });

        Schema::table('pools', function (Blueprint $table) {
            // Add indexes for foreign keys
            $table->index('user_id', 'idx_user_id');
            $table->index('classification_id', 'idx_classification_id');
            $table->index('department_id', 'idx_department_id');
            $table->index('community_id', 'idx_community_id');
            $table->index('work_stream_id', 'idx_work_stream_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropIndex('idx_placed_department_id');
        });

        Schema::table('pools', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex('idx_user_id');
            $table->dropIndex('idx_classification_id');
            $table->dropIndex('idx_department_id');
            $table->dropIndex('idx_community_id');
            $table->dropIndex('idx_work_stream_id');
        });
    }
};
