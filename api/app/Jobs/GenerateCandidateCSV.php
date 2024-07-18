<?php

namespace App\Jobs;

use App\Events\UserFileGenerated;
use App\Generators\CandidateProfileCsv;
use App\Models\User;
use App\Notifications\UserFileGenerationError;
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
        $user = User::find($this->userId);
        $fileName = 'candidates_'.date('Y-m-d_His').'.csv';

        try {
            $generator = new CandidateProfileCsv($this->candidateIds, $this->userId, $this?->lang);
            $generator->generate()->write($fileName, $this->userId);

            UserFileGenerated::dispatch($fileName, $this->userId);
        } catch (\Exception $e) {
            // Notify the user something went wrong
            $user->notify(new UserFileGenerationError($fileName));
            Log::debug('Error generating file: '.$e->getMessage());
        }

    }
}
