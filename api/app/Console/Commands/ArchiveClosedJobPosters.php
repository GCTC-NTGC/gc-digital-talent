<?php

namespace App\Console\Commands;

use App\Enums\JobPosterArchiveType;
use App\Models\JobPosterArchive;
use App\Models\Pool;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:archive-closed-job-posters')]
#[Description('Store the archived poster for all closed pools that do not have one.')]
class ArchiveClosedJobPosters extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        Pool::with(JobPosterArchive::$generationEagerLoads)
            ->whereClosed()
            ->whereDoesntHaveArchive(JobPosterArchiveType::CLOSED)
            ->chunkById(200, function ($pools) {
                foreach ($pools as $pool) {
                    $pool->storeArchive(JobPosterArchiveType::CLOSED);
                }
            });
    }
}
