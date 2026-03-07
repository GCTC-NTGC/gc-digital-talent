<?php

namespace App\Console\Commands;

use App\Models\PoolCandidate;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class UnpauseReferrals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:unpause-referrals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Unpause candidate referrals if date is up';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info($this->description);

        PoolCandidate::where('referral_unpause_at', '<', Carbon::now())
            ->update([
                'referral_pause_at' => null,
                'referral_unpause_at' => null,
                'referral_pause_reason' => null,
            ]);

        $this->info('Successfully unpaused candidate referrals');
    }
}
