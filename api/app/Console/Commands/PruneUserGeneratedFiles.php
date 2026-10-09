<?php

namespace App\Console\Commands;

use App\Support\FilePath;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Throwable;

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
        $this->info('Pruning old user generated files');
        $now = Carbon::now();
        $diskNames = [FilePath::GUARDED_DISK, FilePath::PUBLIC_DISK];
        foreach ($diskNames as $diskName) {
            $disk = Storage::disk($diskName);
            foreach ($disk->allFiles() as $file) {
                if (basename($file) === '.gitignore') {
                    continue;
                }
                // storage may be shared between instances, so another one could delete the file first
                try {
                    $lastModified = Carbon::createFromTimestamp($disk->lastModified($file));
                } catch (Throwable $e) {
                    continue;
                }
                $hoursOld = (int) $lastModified->diffInHours($now);
                $shouldDelete = $hoursOld > 24;
                if ($shouldDelete) {
                    $this->info("Deleting $diskName/$file - $hoursOld hours old");
                    $disk->delete($file);
                }
            }
        }
    }
}
