<?php

namespace Tests\Feature\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EmploymentCategory;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Enums\Language;
use App\Enums\ProvinceOrTerritory;
use App\Enums\SkillLevel;
use App\Generators\UserDocGenerator;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
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

        // Create deterministic fixture data for snapshot tests.
        // All values are hardcoded to ensure stability regardless of
        // any changes to factory faker usage.

        $community = Community::factory()->create([
            'name' => ['en' => 'Test Community EN', 'fr' => 'Test Community FR'],
        ]);

        $department = Department::factory()->create([
            'name' => ['en' => 'Test Department EN', 'fr' => 'Test Department FR'],
        ]);

        $classification = Classification::factory()->create([
            'group' => 'TS',
            'level' => 1,
        ]);

        $workStream = WorkStream::factory()->create([
            'name' => ['en' => 'Test WorkStream EN', 'fr' => 'Test WorkStream FR'],
        ]);

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin.snapshot@test.com',
            ]);

        // Create target user with deterministic values - don't use withGovEmployeeProfile
        // as it creates nested records with random faker values
        $targetUser = User::factory()
            ->asApplicant()
            ->create([
                'first_name' => 'Snapshot',
                'last_name' => 'TestUser',
                'email' => 'snapshot.testuser@test.com',
                'telephone' => '+15551234567',
                'preferred_lang' => Language::EN->toLower(),
                'preferred_language_for_interview' => Language::EN->toLower(),
                'preferred_language_for_exam' => Language::FR->toLower(),
                'current_province' => ProvinceOrTerritory::ONTARIO->name,
                'current_city' => 'Ottawa',
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => true,
                'first_official_language' => Language::EN->toLower(),
                'estimated_language_ability' => EstimatedLanguageAbility::INTERMEDIATE->name,
                'second_language_exam_completed' => false,
                'second_language_exam_validity' => null,
                'comprehension_level' => null,
                'written_level' => null,
                'verbal_level' => null,
                'computed_is_gov_employee' => true,
                'work_email' => 'snapshot.test@gc.ca',
                'computed_classification' => $classification->id,
                'computed_department' => $department->id,
                'computed_gov_employee_type' => GovEmployeeType::INDETERMINATE->name,
                'computed_gov_position_type' => GovPositionType::SUBSTANTIVE->name,
                'is_woman' => false,
                'has_disability' => true,
                'is_visible_minority' => false,
                'has_diploma' => true,
                'location_preferences' => ['TELEWORK', 'NATIONAL_CAPITAL'],
                'location_exemptions' => 'None',
                'position_duration' => null,
                'armed_forces_status' => ArmedForcesStatus::NOT_CAF->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'has_priority_entitlement' => false,
                'priority_number' => null,
            ]);

        // Attach community interest
        $targetUser->communityInterests()->create(['community_id' => $community->id]);

        // Create deterministic work experience
        WorkExperience::factory()->create([
            'user_id' => $targetUser->id,
            'role' => 'Software Developer',
            'organization' => 'Government of Canada',
            'division' => 'Digital Services',
            'start_date' => '2020-01-15',
            'end_date' => null,
            'details' => 'Deterministic work experience details for snapshot testing.',
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::SUBSTANTIVE->name,
            'classification_id' => $classification->id,
            'department_id' => $department->id,
            'supervisory_position' => false,
        ]);

        // Create deterministic skills
        $skills = [];
        foreach (['Skill A', 'Skill B', 'Skill C', 'Skill D'] as $index => $skillName) {
            $skills[] = Skill::factory()->create([
                'name' => ['en' => "{$skillName} EN", 'fr' => "{$skillName} FR"],
            ]);
        }

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
