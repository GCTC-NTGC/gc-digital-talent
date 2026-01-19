<?php

namespace Tests\Feature\Generators;

use App\Generators\UserDocGenerator;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkStream;
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

    protected UserDocGenerator $generator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpFaker();
        $this->faker->seed(0);

        $this->seed(RolePermissionSeeder::class);

        $community = Community::factory()->create();
        Department::factory()->create();
        Classification::factory()->create();
        WorkStream::factory()->create();

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $targetUser = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->withCommunityInterests([$community->id])
            ->create();

        $skills = Skill::factory()->count(4)->create();

        $targetUser->userSkills()->delete();

        $targetUser->userSkills()->createMany([
            ['skill_id' => $skills[0]->id, 'top_skills_rank' => 1, 'improve_skills_rank' => null],
            ['skill_id' => $skills[1]->id, 'top_skills_rank' => 2, 'improve_skills_rank' => null],
            ['skill_id' => $skills[2]->id, 'top_skills_rank' => null, 'improve_skills_rank' => 1],
            ['skill_id' => $skills[3]->id, 'top_skills_rank' => null, 'improve_skills_rank' => 2],
        ]);

        $targetUser->refresh();

        $this->generator = new UserDocGenerator(
            user: $targetUser,
            anonymous: false,
            dir: 'test',
            lang: 'en',
        );

        $this->generator->setAuthenticatedUserId($adminUser->id);

    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {
        // act
        $this->generator->generate()->write();

        // assert
        $path = $this->generator->getRelativePath();
        $disk = Storage::disk('user_generated');

        $fileExists = $disk->exists($path);
        assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        assertGreaterThan(0, $fileSize, 'File is empty');
    }

    // NOTE: Update with `-d --update-snapshots`
    public function testUserProfileDocSnapshot()
    {
        $this->generator
            ->setExtension('html')
            ->generate()
            ->write();

        $disk = Storage::disk('user_generated');
        $contents = $disk->get($this->generator->getRelativePath());

        $this->assertMatchesHtmlSnapshot($contents);
    }
}
