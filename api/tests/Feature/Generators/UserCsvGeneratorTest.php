<?php

namespace Tests\Feature\Generators;

use App\Generators\UserCsvGenerator;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

use function PHPUnit\Framework\assertTrue;

class UserCsvGeneratorTest extends TestCase
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
            ->withSkillsAndExperiences()
            ->create();

        $targetUser2 = User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->create();

        // act
        $fileName = sprintf('%s_%s', __('filename.users'), date('Y-m-d_His'));
        $generator = new UserCsvGenerator(
            fileName: $fileName,
            dir: 'test',
            lang: 'en',
        );

        $generator
            ->setUserId($adminUser->id)
            ->setIds([$targetUser1->id, $targetUser2->id])
            ->setFilters([]);

        $generator->generate()->write();

        // assert
        $disk = Storage::disk('userGenerated');
        $path = 'test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx';

        assertTrue($disk->exists($path), 'File was not generated');
        $fullPath = $disk->path($path);
        $fileHeader = file_get_contents($fullPath, false, null, 0, 2);
        $this->assertEquals(
            'PK',
            $fileHeader,
            'The wrong number of lines are in the file'
        );
    }
}
