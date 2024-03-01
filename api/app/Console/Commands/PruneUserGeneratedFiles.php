<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class PruneUserGeneratedFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:prune-user-generated-files';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prune old user generated files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $disk = Storage::disk('userGenerated');
        $allDirectories = $disk->allDirectories();
        $directoryCount = count($allDirectories);
        $this->info("Checking $directoryCount directories.");
        foreach ($allDirectories as $directory) {
            $allFiles = $disk->allFiles($directory);
            $fileCount = count($allFiles);
            $this->info("Checking directory $directory with $fileCount files.");
            foreach ($allFiles as $file) {
                $lastModified = Carbon::createFromTimestamp($disk->lastModified($file));
                $hoursOld = $now->diffInHours($lastModified);
                $shouldDelete = $hoursOld > 12;
                $this->info("$file - $lastModified - $shouldDelete");
                //if ($shouldDelete) $disk->delete($file);
            }
        }
    }
}
