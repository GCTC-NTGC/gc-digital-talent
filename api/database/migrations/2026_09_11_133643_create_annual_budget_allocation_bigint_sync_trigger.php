<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION sync_annual_budget_allocation_bigint()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.annual_budget_allocation_big_int := NEW.annual_budget_allocation;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trigger_sync_annual_budget_allocation_bigint
            BEFORE INSERT OR UPDATE ON work_experiences
            FOR EACH ROW EXECUTE FUNCTION sync_annual_budget_allocation_bigint();
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared(<<<'SQL'
            DROP TRIGGER IF EXISTS trigger_sync_annual_budget_allocation_bigint ON work_experiences;
            DROP FUNCTION IF EXISTS sync_annual_budget_allocation_bigint();
        SQL);
    }
};
