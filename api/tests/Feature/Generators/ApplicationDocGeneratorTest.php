<?php

namespace Tests\Feature\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\EmploymentCategory;
use App\Enums\GovEmployeeType;
use App\Enums\Language;
use App\Enums\PoolSkillType;
use App\Enums\ProvinceOrTerritory;
use App\Enums\SkillCategory;
use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Enums\WorkRegion;
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

        // Create deterministic test data - avoid factories that use inRandomOrder()
        $department = Department::factory()->create([
            'name' => ['en' => 'Test Department EN', 'fr' => 'Test Department FR'],
        ]);

        $classification = Classification::factory()->create([
            'group' => 'IT',
            'level' => 3,
            'name' => ['en' => 'Information Technology', 'fr' => 'Technologie de l\'information'],
        ]);

        $community = Community::where('key', 'digital')->sole();

        $adminUser = User::factory()->asApplicant()->asAdmin()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@test.com',
        ]);

        // Create user with explicit deterministic data (no withGovEmployeeProfile which uses inRandomOrder)
        $user = User::factory()
            ->asApplicant()
            ->create([
                'first_name' => 'Test',
                'last_name' => 'Applicant',
                'email' => 'applicant@test.com',
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

        // Create education experience with explicit data
        $edu = EducationExperience::factory()->for($user)->create([
            'institution' => 'Test University',
            'area_of_study' => 'Computer Science',
            'thesis_title' => 'Test Thesis Title',
            'type' => EducationType::MASTERS->name,
            'status' => EducationStatus::SUCCESS_CREDENTIAL->name,
            'start_date' => '2015-09-01',
            'end_date' => '2017-06-30',
            'details' => 'Deterministic education details for snapshot testing.',
        ]);

        // Create work experience with explicit data (instead of using withGovEmployeeProfile)
        $work = WorkExperience::factory()->for($user)->create([
            'role' => 'Software Developer',
            'organization' => 'Government of Canada',
            'division' => 'Technology Division',
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'start_date' => '2017-07-01',
            'end_date' => null,
            'details' => 'Deterministic work experience details for snapshot testing.',
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
