<?php

namespace Tests\Feature\Generators;

use App\Generators\UserDocGenerator;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class UserDocGeneratorTest extends TestCase
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
            ->withSkillsAndExperiences()
            ->create();

        // act
        $generator = new UserDocGenerator(
            user: $targetUser,
            anonymous: false,
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
