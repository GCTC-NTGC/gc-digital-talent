<?php

namespace App\Console\Commands;

use App\Enums\JobPosterArchiveType;
use App\Events\CommandProducedResults;
use App\Models\JobPosterArchive;
use App\Models\Pool;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

#[Signature('app:archive-closed-job-posters')]
#[Description('Store the archived poster for all closed pools that do not have one.')]
class ArchiveClosedJobPosters extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        Pool::with(JobPosterArchive::$generationEagerLoads)
            ->whereClosed()
            ->whereDoesNotHaveArchive(JobPosterArchiveType::CLOSED)
            ->chunkById(200, function ($pools) use (&$successCount, &$failureCount) {
                foreach ($pools as $pool) {
                    Log::withContext([
                        'id' => $pool->id,
                        'name' => $pool->name['en'],
                    ]);

                    try {
                        $pool->storeArchive(JobPosterArchiveType::CLOSED);
                        Log::channel('jobs')->info('Archived closed job poster');
                        $successCount++;
                    } catch (Throwable $e) {
                        Log::channel('jobs')->error('Failed to archive closed job poster', [
                            'exception' => $e->getMessage(),
                        ]);
                        $failureCount++;
                    }
                }
            });

        CommandProducedResults::dispatch($this->getName(), [
            'Posters archived' => $successCount,
            'Posters failed' => $failureCount,
        ]);

        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }
}
