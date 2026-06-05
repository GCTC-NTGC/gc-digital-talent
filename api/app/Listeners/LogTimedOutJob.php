<?php

namespace App\Listeners;

use Illuminate\Queue\Events\JobTimedOut;
use Illuminate\Support\Facades\Log;

class LogTimedOutJob
{
    public function handle(JobTimedOut $event): void
    {
        Log::channel('jobs')->error('Queue job timed out', [
            'connection' => $event->connectionName,
            'queue' => $event->job->getQueue(),
            'job' => $event->job->getName(),
            'job_id' => $event->job->getJobId(),
        ]);
    }
}
