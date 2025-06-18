<?php

namespace Tests\Feature;

use App\Generators\ApplicationZipGenerator;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class ApplicationZipGeneratorTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ClassificationSeeder::class);
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
        $fileName = sprintf('%s_%s', __('filename.candidates'), date('Y-m-d_His'));
        $generator = new ApplicationZipGenerator(
            ids: [$application1->id, $application2->id],
            fileName: $fileName,
            dir: 'test',
            lang: 'en'
        );

        $generator->setUserId($adminUser->id);
        $generator->generate()->write();
        $fileName = $generator->getFileNameWithExtension();

        // assert
        $disk = Storage::disk('userGenerated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName;

        $fileExists = $disk->exists($path);
        assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        assertGreaterThan(0, $fileSize, 'File is empty');
    }
}
