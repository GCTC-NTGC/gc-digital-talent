<?php

namespace Tests\Feature\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\Language;
use App\Enums\ProvinceOrTerritory;
use App\Enums\SkillCategory;
use App\Enums\SkillLevel;
use App\Enums\WorkRegion;
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

        // Create deterministic test data - avoid factories that use inRandomOrder()
        $community = Community::factory()->create([
            'name' => ['en' => 'Test Community EN', 'fr' => 'Test Community FR'],
        ]);

        Department::factory()->create([
            'name' => ['en' => 'Test Department EN', 'fr' => 'Test Department FR'],
        ]);

        Classification::factory()->create([
            'group' => 'IT',
            'level' => 3,
            'name' => ['en' => 'Information Technology', 'fr' => 'Technologie de l\'information'],
        ]);

        WorkStream::factory()->create([
            'name' => ['en' => 'Software Development EN', 'fr' => 'Développement logiciel FR'],
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

        // Create user with explicit deterministic data (no withGovEmployeeProfile which uses inRandomOrder)
        $targetUser = User::factory()
            ->asApplicant()
            ->create([
                'first_name' => 'Test',
                'last_name' => 'Candidate',
                'email' => 'candidate@test.com',
                'telephone' => '+16135551234',
                'preferred_lang' => Language::EN->name,
                'preferred_language_for_interview' => Language::EN->name,
                'preferred_language_for_exam' => Language::EN->name,
                'current_city' => 'Ottawa',
                'current_province' => ProvinceOrTerritory::ONTARIO->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
                'location_preferences' => [WorkRegion::NATIONAL_CAPITAL->name],
                'position_duration' => null,
                'accepted_operational_requirements' => null,
                'location_exemptions' => null,
            ]);

        // Create skills with deterministic names
        $skill1 = Skill::factory()->create([
            'name' => ['en' => 'Technical Skill 1 EN', 'fr' => 'Compétence technique 1 FR'],
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $skill2 = Skill::factory()->create([
            'name' => ['en' => 'Technical Skill 2 EN', 'fr' => 'Compétence technique 2 FR'],
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $skill3 = Skill::factory()->create([
            'name' => ['en' => 'Behavioural Skill 1 EN', 'fr' => 'Compétence comportementale 1 FR'],
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);
        $skill4 = Skill::factory()->create([
            'name' => ['en' => 'Behavioural Skill 2 EN', 'fr' => 'Compétence comportementale 2 FR'],
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);

        $targetUser->userSkills()->delete();

        $targetUser->userSkills()->createMany([
            ['skill_id' => $skill1->id, 'top_skills_rank' => 1, 'improve_skills_rank' => null, 'skill_level' => SkillLevel::ADVANCED->name],
            ['skill_id' => $skill2->id, 'top_skills_rank' => 2, 'improve_skills_rank' => null, 'skill_level' => SkillLevel::LEAD->name],
            ['skill_id' => $skill3->id, 'top_skills_rank' => null, 'improve_skills_rank' => 1, 'skill_level' => SkillLevel::BEGINNER->name],
            ['skill_id' => $skill4->id, 'top_skills_rank' => null, 'improve_skills_rank' => 2, 'skill_level' => SkillLevel::INTERMEDIATE->name],
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
