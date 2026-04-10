<?php

namespace Tests\Feature\Generators;

use App\Enums\SkillCategory;
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
use Illuminate\Support\Facades\Storage;
use Spatie\Snapshots\MatchesSnapshots;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class UserDocGeneratorTest extends TestCase
{
    use MatchesSnapshots;
    use RefreshDatabase;

    protected UserDocGenerator $generator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        // Create all models with explicit, deterministic data for snapshot stability
        $department = Department::factory()->create([
            'name' => ['en' => 'Test Department EN', 'fr' => 'Test Department FR'],
        ]);

        $classification = Classification::factory()->create([
            'group' => 'IT',
            'level' => 3,
            'name' => ['en' => 'Information Technology', 'fr' => 'Technologie de l\'information'],
        ]);

        $community = Community::factory()->create([
            'name' => ['en' => 'Test Community EN', 'fr' => 'Test Community FR'],
        ]);

        WorkStream::factory()->create([
            'name' => ['en' => 'Software Development EN', 'fr' => 'Développement de logiciels FR'],
            'community_id' => $community->id,
        ]);

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@test.com',
            ]);

        // Create target user with explicit data - don't use withGovEmployeeProfile
        // as it uses inRandomOrder() internally
        $targetUser = User::factory()
            ->asApplicant()
            ->create([
                'first_name' => 'Test',
                'last_name' => 'Candidate',
                'email' => 'candidate@test.com',
                'telephone' => '+16135551234',
                'current_city' => 'Ottawa',
            ]);

        // Create skills with fixed categories
        $technicalSkill1 = Skill::factory()->create([
            'name' => ['en' => 'Technical Skill 1 EN', 'fr' => 'Compétence technique 1 FR'],
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $technicalSkill2 = Skill::factory()->create([
            'name' => ['en' => 'Technical Skill 2 EN', 'fr' => 'Compétence technique 2 FR'],
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $behaviouralSkill1 = Skill::factory()->create([
            'name' => ['en' => 'Behavioural Skill 1 EN', 'fr' => 'Compétence comportementale 1 FR'],
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);
        $behaviouralSkill2 = Skill::factory()->create([
            'name' => ['en' => 'Behavioural Skill 2 EN', 'fr' => 'Compétence comportementale 2 FR'],
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);

        $targetUser->userSkills()->delete();

        $targetUser->userSkills()->createMany([
            ['skill_id' => $technicalSkill1->id, 'top_skills_rank' => 1, 'improve_skills_rank' => null, 'skill_level' => SkillLevel::ADVANCED->name],
            ['skill_id' => $behaviouralSkill1->id, 'top_skills_rank' => 2, 'improve_skills_rank' => null, 'skill_level' => SkillLevel::LEAD->name],
            ['skill_id' => $technicalSkill2->id, 'top_skills_rank' => null, 'improve_skills_rank' => 1, 'skill_level' => SkillLevel::BEGINNER->name],
            ['skill_id' => $behaviouralSkill2->id, 'top_skills_rank' => null, 'improve_skills_rank' => 2, 'skill_level' => SkillLevel::INTERMEDIATE->name],
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
