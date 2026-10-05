<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * WHEN TO RUN: Any time after the migrations
 * shadow column (2026_09_10_122451_add_big_int_annual_budget_allocation_column.php), and
 * sync trigger (2026_09_11_133643_create_annual_budget_allocation_bigint_sync_trigger.php)
 * have deployed to production.
 *
 * HOW LONG: Production is ~20,000 rows, so this single UPDATE should complete in well
 * under a second.
 *
 * SAFE TO RERUN: Yes, idempotent — the WHERE clause only touches rows still out
 * of sync, so a clean rerun reports 0 rows backfilled.
 *
 * VERIFY SUCCESS: After running, confirm with:
 *
 * SELECT COUNT(*) FROM work_experiences WHERE annual_budget_allocation IS DISTINCT FROM annual_budget_allocation_big_int;
 *
 * Must return 0 before the column-rename migration (Part 2) is deployed.
 *
 * WHEN TO REMOVE: Once the column-rename migration (Part 2) has run,
 * annual_budget_allocation_big_int no longer exists and this command has
 * nothing left to do — delete it at that point.
 */
#[Signature('app:backfill-annual-budget-allocation-big-int')]
#[Description('Copies work_experiences.annual_budget_allocation into the shadow annual_budget_allocation_big_int column, for the zero-downtime bigint migration (issue #17844).')]
class BackfillAnnualBudgetAllocationBigInt extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $affected = DB::update(<<<'SQL'
            UPDATE work_experiences
            SET annual_budget_allocation_big_int = annual_budget_allocation
            WHERE annual_budget_allocation_big_int IS DISTINCT FROM annual_budget_allocation
            SQL
        );

        $this->info("{$affected} rows backfilled");
    }
}
