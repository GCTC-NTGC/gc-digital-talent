<?php

namespace App\Console\Commands;

use App\Models\PoolCandidate;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class ResumeReferrals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:resume_referrals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Resume referrals for a candidate when the date is reached';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info($this->description);

        PoolCandidate::where('resume_referrals_at', '<', Carbon::now())
            ->update([
                'pause_referrals_at' => null,
                'resume_referrals_at' => null,
                'pause_referrals_reason' => null,
            ]);

        $this->info('Successfully resumed referrals for a candidate');
    }
}
