<?php

namespace App\Console\Commands;

use App\Enums\PlacementType;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Lang;

/**
 * Sync referral status by pausing candidates who have
 * placement_type = PLACED_INDETERMINATE
 */
class SyncReferralStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-referral-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs candidate referral status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::table('pool_candidates')
            ->where('placement_type', PlacementType::PLACED_INDETERMINATE->name)
            ->update([
                'pause_referrals_at' => Carbon::now(),
                'pause_referrals_reason' => Lang::get('common.successfully_placed'),
                'resume_referrals_at' => DB::raw('expiry_date'),
            ]);
    }
}
