<?php

namespace Tests\Feature;

use App\Support\FilePath;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PruneUserGeneratedFilesTest extends TestCase
{
    public static function diskProvider(): array
    {
        return [
            'guarded disk' => [FilePath::GUARDED_DISK],
            'public disk' => [FilePath::PUBLIC_DISK],
        ];
    }

    #[DataProvider('diskProvider')]
    public function testDeletesOnlyFilesOlderThanOneDay(string $diskName): void
    {
        // fake both disks so the command never touches real storage
        Storage::fake(FilePath::GUARDED_DISK);
        Storage::fake(FilePath::PUBLIC_DISK);
        $disk = Storage::disk($diskName);

        $disk->put('user-id/old.xlsx', 'old');
        $disk->put('user-id/new.xlsx', 'new');
        touch($disk->path('user-id/old.xlsx'), now()->subHours(26)->timestamp);
        touch($disk->path('user-id/new.xlsx'), now()->subHour()->timestamp);

        $this->artisan('app:prune-user-generated-files')
            ->assertExitCode(Command::SUCCESS);

        $disk->assertMissing('user-id/old.xlsx');
        $disk->assertExists('user-id/new.xlsx');
    }
}
