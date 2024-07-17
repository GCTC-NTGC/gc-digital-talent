<?php

namespace App\Jobs;

use App\Events\UserFileGenerated;
use App\Generators\CandidateProfileCsv;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateCandidateCSV implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public array $candidateIds, public string $userId, public string $lang = 'en') {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $generator = new CandidateProfileCsv($this->candidateIds, $this->userId, $this?->lang);
            $fileName = 'candidates_'.date('Y-m-d_His').'.csv';
            $generator->generate()->write($fileName, $this->userId);

            UserFileGenerated::dispatch($fileName, $this->userId);
        } catch (\Exception $e) {
            Log::debug('Error generating file: '.$e->getMessage());
        }

    }
}
