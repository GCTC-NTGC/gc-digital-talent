<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

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
