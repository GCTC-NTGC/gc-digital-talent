<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:sync-placement-type')]
#[Description('Syncs placement_type to match application status: sets NOT_PLACED for qualified candidates, clears placement fields for non-qualified.')]
class SyncPlacementType extends Command
{
	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		DB::transaction(function () {
			$backfilledCount = DB::update(<<<'SQL'
				UPDATE pool_candidates
				SET placement_type = 'NOT_PLACED'
				WHERE application_status = 'QUALIFIED'
				AND placement_type IS NULL
				SQL
			);

			$clearedCount = DB::update(<<<'SQL'
				UPDATE pool_candidates
				SET placement_type = NULL,
					placed_at = NULL,
					placed_department_id = NULL,
					placed_start_date = NULL,
					placed_end_date = NULL
				WHERE application_status != 'QUALIFIED'
				AND placement_type IS NOT NULL
				SQL
			);

			$this->info("{$backfilledCount} qualified candidates backfilled with NOT_PLACED");
			$this->info("{$clearedCount} non-qualified candidates had placement fields cleared");
		});
	}
}
