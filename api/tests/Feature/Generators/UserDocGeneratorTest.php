<?php

namespace Tests\Feature\Generators;

use App\Generators\UserDocGenerator;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
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
            ->asGovEmployee()
            ->withCommunityInterests([$community->id])
            ->withEmployeeProfile()
            ->withSkillsAndExperiences()
            ->create();

        // Faker seed makes skill ranks the same.
        // This is not realistic data so we are forcing them
        // to be different
        $targetUser->userSkills()->with('skill')->get()
            ->sortBy(fn ($userSkill) => $userSkill->skill->key)
            ->values()
            ->each(function ($userSkill, $index) {
                if ($userSkill->top_skills_rank) {
                    $userSkill->top_skills_rank = $index + 1;
                    $userSkill->save();
                }
                if ($userSkill->improve_skills_rank) {
                    $userSkill->improve_skills_rank = $index + 1;
                    $userSkill->save();
                }
            });

        $targetUser->refresh();

        $this->generator = new UserDocGenerator(
            user: $targetUser,
            anonymous: false,
            dir: 'test',
            lang: 'en',
            authenticatedUser: $adminUser,
        );

        $this->generator->setUserId($adminUser->id);

    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {
        // act
        $this->generator->generate()->write();

        // assert
        $path = $this->generator->getRelativePath();
        $disk = Storage::disk('userGenerated');

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

        $disk = Storage::disk('userGenerated');
        $contents = $disk->get($this->generator->getRelativePath());

        $this->assertMatchesHtmlSnapshot($contents);
    }
}
