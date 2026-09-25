<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
            DROP TRIGGER IF EXISTS trigger_sync_annual_budget_allocation_bigint ON work_experiences;
            DROP FUNCTION IF EXISTS sync_annual_budget_allocation_bigint();
        SQL);

        Schema::table('work_experiences', function (Blueprint $table) {
            $table->renameColumn('annual_budget_allocation', 'annual_budget_allocation_old');
            $table->renameColumn('annual_budget_allocation_big_int', 'annual_budget_allocation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_experiences', function (Blueprint $table) {
            $table->renameColumn('annual_budget_allocation', 'annual_budget_allocation_big_int');
            $table->renameColumn('annual_budget_allocation_old', 'annual_budget_allocation');
        });

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
};
