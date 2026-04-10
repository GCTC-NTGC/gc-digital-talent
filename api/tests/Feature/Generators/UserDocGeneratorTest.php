<?php

namespace Tests\Feature\Generators;

use App\Enums\SkillLevel;
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
use Tests\SeededFaker;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class UserDocGeneratorTest extends TestCase
{
    use MatchesSnapshots;
    use RefreshDatabase;
    use SeededFaker;
    use WithFaker;

    protected UserDocGenerator $generator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpFaker();

        $this->seed(RolePermissionSeeder::class);

        // Reseed faker before each factory to isolate random sequences.
        // This ensures changes to any factory's faker usage won't affect
        // the output of other factories in these snapshot tests.
        $this->seedFaker(1);
        $community = Community::factory()->create();

        $this->seedFaker(2);
        Department::factory()->create();

        $this->seedFaker(3);
        Classification::factory()->create();

        $this->seedFaker(4);
        WorkStream::factory()->create();

        $this->seedFaker(5);
        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $this->seedFaker(6);
        $targetUser = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->withCommunityInterests([$community->id])
            ->create();

        $this->seedFaker(7);
        $skills = Skill::factory()->count(4)->create();

        $targetUser->userSkills()->delete();

        $targetUser->userSkills()->createMany([
            ['skill_id' => $skills[0]->id, 'top_skills_rank' => 1, 'improve_skills_rank' => null, 'skill_level' => SkillLevel::ADVANCED->name],
            ['skill_id' => $skills[1]->id, 'top_skills_rank' => 2, 'improve_skills_rank' => null, 'skill_level' => SkillLevel::LEAD->name],
            ['skill_id' => $skills[2]->id, 'top_skills_rank' => null, 'improve_skills_rank' => 1, 'skill_level' => SkillLevel::BEGINNER->name],
            ['skill_id' => $skills[3]->id, 'top_skills_rank' => null, 'improve_skills_rank' => 2, 'skill_level' => SkillLevel::INTERMEDIATE->name],
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
