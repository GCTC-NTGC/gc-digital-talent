<?php

namespace Tests\Feature\Generators;

use App\Generators\UserExcelGenerator;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UserExcelGeneratorTest extends TestCase
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

        $targetUser1 = User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->create();

        $targetUser2 = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->create();

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new UserExcelGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en',
        );

        $generator
            ->setAuthenticatedUserId($adminUser->id)
            ->setIds([$targetUser1->id, $targetUser2->id])
            ->setFilters([]);

        $generator->generate()->write();

        // assert
        $disk = Storage::disk('userGenerated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx';

        $fileExists = $disk->exists($path);
        $this->assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        $this->assertGreaterThan(0, $fileSize, 'File is empty');
    }
}
