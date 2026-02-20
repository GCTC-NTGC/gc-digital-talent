<?php

namespace Tests\Feature\Generators;

use App\Enums\PoolSkillType;
use App\Enums\SkillCategory;
use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Generators\ApplicationDocGenerator;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Spatie\Snapshots\MatchesSnapshots;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class ApplicationDocGeneratorTest extends TestCase
{
    use MatchesSnapshots;
    use RefreshDatabase;
    use WithFaker;

    protected ApplicationDocGenerator $generator;

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

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $user = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->withCommunityInterests([$community->id])
            ->create();

        $edu = EducationExperience::factory()->for($user)->create();
        $work = WorkExperience::factory()->for($user)->create();

        $fixedSkill = Skill::factory()->create([
            'category' => SkillCategory::TECHNICAL->name,
        ]);

        $pool = Pool::factory()->published()->create();
        $pool->poolSkills()->delete();
        $pool->poolSkills()->create([
            'skill_id' => $fixedSkill->id,
            'type' => PoolSkillType::ESSENTIAL->name,
        ]);

        $userSkill = UserSkill::create([
            'user_id' => $user->id,
            'skill_id' => $fixedSkill->id,
            'skill_level' => SkillLevel::ADVANCED->name,
            'when_skill_used' => WhenSkillUsed::PAST->name,
        ]);
        $edu->userSkills()->attach($userSkill->id, ['details' => 'Deterministic snapshot detail.']);
        $work->userSkills()->attach($userSkill->id, ['details' => 'Deterministic snapshot detail.']);

        $application = PoolCandidate::factory()
            ->availableInSearch()
            ->withSnapshot()
            ->for($user)
            ->for($pool)
            ->create(['signature' => 'Test signature']);

        $application->submitted_at = config('constants.past_datetime');
        $application->save();

        $this->generator = new ApplicationDocGenerator(
            candidate: $application,
            dir: 'test',
            lang: 'en',
        );

        $this->generator->setAuthenticatedUserId($adminUser->id);
    }

    // test that a file can be generated
    public function testCanGenerateFile(): void
    {

        $this->generator->generate()->write();
        $path = $this->generator->getRelativePath();

        // assert
        $disk = Storage::disk('user_generated');

        $fileExists = $disk->exists($path);
        assertTrue($fileExists, 'File was not generated');
        $fileSize = $disk->size($path);
        assertGreaterThan(0, $fileSize, 'File is empty');
    }

    // NOTE: Update with `-d --update-snapshots`
    public function testApplicationDocSnapshot()
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
