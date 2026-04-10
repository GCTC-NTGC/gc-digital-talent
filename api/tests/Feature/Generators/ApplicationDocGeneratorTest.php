<?php

namespace Tests\Feature\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EmploymentCategory;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Enums\Language;
use App\Enums\PoolSkillType;
use App\Enums\ProvinceOrTerritory;
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
use Illuminate\Support\Facades\Storage;
use Spatie\Snapshots\MatchesSnapshots;
use Tests\TestCase;

use function PHPUnit\Framework\assertGreaterThan;
use function PHPUnit\Framework\assertTrue;

class ApplicationDocGeneratorTest extends TestCase
{
    use MatchesSnapshots;
    use RefreshDatabase;

    protected ApplicationDocGenerator $generator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            CommunitySeeder::class,
        ]);

        // Create deterministic fixture data for snapshot tests.
        // All values are hardcoded to ensure stability regardless of
        // any changes to factory faker usage.

        $department = Department::factory()->create([
            'name' => ['en' => 'Test Department EN', 'fr' => 'Test Department FR'],
        ]);

        $classification = Classification::factory()->create([
            'group' => 'XX',
            'level' => 1,
        ]);

        $community = Community::where('key', 'digital')->sole();

        $adminUser = User::factory()->asApplicant()->asAdmin()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin.app.snapshot@test.com',
        ]);

        // Create user with deterministic values - don't use withGovEmployeeProfile
        // as it creates nested records with random faker values
        $user = User::factory()
            ->asApplicant()
            ->create([
                'first_name' => 'Application',
                'last_name' => 'TestUser',
                'email' => 'application.testuser@test.com',
                'telephone' => '+15559876543',
                'preferred_lang' => Language::FR->toLower(),
                'preferred_language_for_interview' => Language::EN->toLower(),
                'preferred_language_for_exam' => Language::FR->toLower(),
                'current_province' => ProvinceOrTerritory::QUEBEC->name,
                'current_city' => 'Montreal',
                'looking_for_english' => false,
                'looking_for_french' => true,
                'looking_for_bilingual' => true,
                'first_official_language' => Language::FR->toLower(),
                'estimated_language_ability' => EstimatedLanguageAbility::ADVANCED->name,
                'second_language_exam_completed' => false,
                'second_language_exam_validity' => null,
                'comprehension_level' => null,
                'written_level' => null,
                'verbal_level' => null,
                'computed_is_gov_employee' => true,
                'work_email' => 'application.test@gc.ca',
                'computed_classification' => $classification->id,
                'computed_department' => $department->id,
                'computed_gov_employee_type' => GovEmployeeType::INDETERMINATE->name,
                'computed_gov_position_type' => GovPositionType::SUBSTANTIVE->name,
                'is_woman' => true,
                'has_disability' => false,
                'is_visible_minority' => false,
                'has_diploma' => true,
                'location_preferences' => ['NATIONAL_CAPITAL', 'QUEBEC'],
                'location_exemptions' => null,
                'position_duration' => null,
                'armed_forces_status' => ArmedForcesStatus::MEMBER->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'has_priority_entitlement' => false,
                'priority_number' => null,
            ]);

        // Attach community interest
        $user->communityInterests()->create(['community_id' => $community->id]);

        // Create deterministic education experience
        $edu = EducationExperience::factory()->for($user)->create([
            'institution' => 'Test University',
            'area_of_study' => 'Computer Science',
            'thesis_title' => 'Deterministic Thesis Title',
            'start_date' => '2015-09-01',
            'end_date' => '2019-05-15',
            'details' => 'Deterministic education details for snapshot testing.',
        ]);

        // Create deterministic work experience
        $work = WorkExperience::factory()->create([
            'user_id' => $user->id,
            'role' => 'Test Developer',
            'organization' => 'Government of Canada',
            'division' => 'Test Division',
            'start_date' => '2019-06-01',
            'end_date' => null,
            'details' => 'Deterministic work experience details for snapshot testing.',
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::SUBSTANTIVE->name,
            'classification_id' => $classification->id,
            'department_id' => $department->id,
            'supervisory_position' => false,
        ]);

        $fixedSkill = Skill::factory()->create([
            'name' => [
                'en' => 'Snapshot skill EN',
                'fr' => 'Snapshot skill FR',
            ],
            'category' => SkillCategory::TECHNICAL->name,
        ]);

        $pool = Pool::factory()->published()->create([
            'process_number' => '12345',
            'name' => [
                'en' => 'Snapshot pool EN',
                'fr' => 'Snapshot pool FR',
            ],
        ]);
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
