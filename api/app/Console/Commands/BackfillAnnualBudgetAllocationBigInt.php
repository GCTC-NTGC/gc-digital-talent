<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:backfill-annual-budget-allocation-big-int')]
#[Description('Copies work_experiences.annual_budget_allocation into the shadow annual_budget_allocation_big_int column in chunks, for the zero-downtime bigint migration (issue #17844).')]
class BackfillAnnualBudgetAllocationBigInt extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $chunkSize = 5000;
        $lastProcessedId = null;

        $this->info('Starting backfill...');

        do {
            $ids = DB::table('work_experiences')
                ->when($lastProcessedId !== null, fn ($query) => $query->where('id', '>', $lastProcessedId))
                ->orderBy('id')
                ->limit($chunkSize)
                ->pluck('id')
                ->all();

            if (empty($ids)) {
                break;
            }

            $affected = DB::table('work_experiences')
                ->whereIn('id', $ids)
                ->update(['annual_budget_allocation_big_int' => DB::raw('annual_budget_allocation')]);

            $lastProcessedId = max($ids);

            $this->line("Processed chunk. Max ID: {$lastProcessedId} (updated rows: {$affected})");

            usleep(200000);
        } while (count($ids) === $chunkSize);

        $this->info('Backfill completed successfully!');
    }
}
