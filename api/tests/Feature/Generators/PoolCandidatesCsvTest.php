<?php

namespace Tests\Feature;

use App\Generators\PoolCandidateCsvGenerator;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertTrue;

class PoolCandidatesCsvTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {
        // arrange
        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $application1 = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create();

        $application2 = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create();

        // act
        $fileName = sprintf('%s_%s', __('filename.candidates_rod'), date('Y-m-d_His'));
        $generator = new PoolCandidateCsvGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en',
            withROD: true,
        );

        $generator
            ->setUserId($adminUser->id)
            ->setIds([$application1->id, $application2->id])
            ->setFilters([]);

        $generator->generate()->write();

        // assert
        $disk = Storage::disk('userGenerated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName.'.csv';

        $fileExists = $disk->exists($path);
        assertTrue($fileExists, 'File was not generated');
        $lineCount = count(file($disk->path($path)));
        assertEquals(3, $lineCount, 'The wrong number of lines are in the file');
    }
}
