<?php

namespace Tests\Feature\Generators;

use App\Generators\PoolCandidateExcelGenerator;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PoolCandidatesExcelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            RolePermissionSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
        ]);
    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {
        // arrange
        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $targetUser = User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->create();

        $application1 = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create(['user_id' => $targetUser->id]);

        $application2 = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->create(['user_id' => $targetUser->id]);

        // act
        $fileName = sprintf('%s_%s', __('filename.candidates_rod'), date('Y-m-d_His'));
        $generator = new PoolCandidateExcelGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en',
            withROD: true,
        );

        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds([$application1->id, $application2->id])
            ->setFilters([]);

        $generator->generate()->write();

        // assert
        $disk = Storage::disk('user_generated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx';

        $fileExists = $disk->exists($path);
        $this->assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        $this->assertGreaterThan(0, $fileSize, 'File is empty');
    }
}
