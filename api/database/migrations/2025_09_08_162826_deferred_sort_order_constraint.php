<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // allows swapping step orders in a transaction
        DB::statement(<<<'SQL'
            ALTER TABLE assessment_steps
                DROP CONSTRAINT assessment_steps_pool_id_sort_order_unique,
                ADD CONSTRAINT assessment_steps_pool_id_sort_order_unique UNIQUE (pool_id, sort_order) DEFERRABLE INITIALLY DEFERRED;
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement(<<<'SQL'
            ALTER TABLE assessment_steps
                DROP CONSTRAINT assessment_steps_pool_id_sort_order_unique,
                ADD CONSTRAINT assessment_steps_pool_id_sort_order_unique UNIQUE (pool_id, sort_order);
        SQL);
    }
};
