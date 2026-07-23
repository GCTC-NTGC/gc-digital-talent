<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:reset-placement-type')]
#[Description('Resets all NULL placement_type values to NOT_PLACED (reversal of sync-placement-type).')]
class ResetPlacementType extends Command
{
	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		$updatedCount = DB::update(<<<'SQL'
			UPDATE pool_candidates
			SET placement_type = 'NOT_PLACED'
			WHERE placement_type IS NULL
			SQL
		);

		$this->info("{$updatedCount} candidates reset to NOT_PLACED");
	}
}
