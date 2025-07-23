<?php

namespace Tests\Feature\Generators;

use App\Generators\UserDocGenerator;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\User;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Spatie\Snapshots\MatchesSnapshots;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class UserDocGeneratorTest extends TestCase
{
    use MatchesSnapshots;
    use RefreshDatabase;
    use WithFaker;

    protected User $adminUser;

    protected User $targetUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpFaker();

        $this->faker->seed(0);

        $this->seed([
            RolePermissionSeeder::class,
            CommunitySeeder::class,
        ]);

        Department::factory()->create();
        Classification::factory()->create();

        $community = Community::where('key', 'digital')->sole();

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $this->targetUser = User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->withCommunityInterests([$community->id])
            ->withEmployeeProfile()
            ->withSkillsAndExperiences()
            ->create();

    }

    // test that a file can be generated
    public function test_can_generate_file(): void
    {
        // act
        $generator = new UserDocGenerator(
            user: $this->targetUser,
            anonymous: false,
            dir: 'test',
            lang: 'en'
        );

        $generator->setUserId($this->adminUser->id);
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

    public function test_user_profile_doc()
    {
        $generator = new UserDocGenerator(user: $this->targetUser, anonymous: false, dir: 'test', lang: 'en');
        $generator
            ->setUserId($this->adminUser->id)
            ->setExtension('html')
            ->generate()
            ->write();

        $disk = Storage::disk('userGenerated');
        $contents = $disk->get($generator->getRelativePath());

        echo $generator->getPath();

        $this->assertMatchesHtmlSnapshot($contents);

    }
}
