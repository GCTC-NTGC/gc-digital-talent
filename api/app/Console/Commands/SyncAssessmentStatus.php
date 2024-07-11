<?php

namespace App\Console\Commands;

use App\Models\PoolCandidate;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;

class SyncAssessmentStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-assessment-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs pool candidate assessment statuses with new logic';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        PoolCandidate::chunk(100, function (Collection $candidates) {
            foreach ($candidates as $candidate) {
                $assessmentStatus = $candidate->computeAssessmentStatus();

                $candidate->computed_assessment_status = $assessmentStatus;

                $candidate->save();
            }
        });
    }
}
