<?php

namespace Tests\Feature\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\CSuiteRoleTitle;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\ExecCoaching;
use App\Enums\FlexibleWorkLocation;
use App\Enums\HiringPlatform;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\LearningOpportunitiesInterest;
use App\Enums\Mentorship;
use App\Enums\OperationalRequirement;
use App\Enums\OrganizationTypeInterest;
use App\Enums\PositionDuration;
use App\Enums\ProvinceOrTerritory;
use App\Enums\SkillLevel;
use App\Enums\TargetRole;
use App\Enums\TimeFrame;
use App\Generators\UserDocGenerator;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\DevelopmentProgram;
use App\Models\OffPlatformRecruitmentProcess;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
use App\Models\WorkStream;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
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
        DevelopmentProgram::factory()->for($community)->create([
            'name' => [
                'en' => 'Snapshot program EN',
                'fr' => 'Snapshot program FR',
            ],
        ]);
        $department = Department::factory()->create([
            'name' => [
                'en' => 'Snapshot dept EN',
                'fr' => 'Snapshot dept FR',
            ],
        ]);
        $classification = Classification::factory()->create([
            'group' => 'XX',
            'level' => 1,
            'name' => [
                'en' => 'Snapshot classification EN',
                'fr' => 'Snapshot classification FR',
            ],
        ]);
        $workStream = WorkStream::factory()->create([
            'name' => [
                'en' => 'Snapshot work stream EN',
                'fr' => 'Snapshot work stream FR',
            ],
        ]);

        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $targetUser = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->withCommunityInterests([$community->id])
            ->create([
                // Contact info section
                'first_name' => 'Snapshot',
                'last_name' => 'User',
                'email' => 'snapshot@test.com',
                'telephone' => '555-555-5555',
                'preferred_lang' => Language::FR->name,
                'preferred_language_for_interview' => Language::FR->name,
                'preferred_language_for_exam' => Language::FR->name,
                // Status
                'armed_forces_status' => ArmedForcesStatus::NON_CAF->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                // Language info
                'looking_for_english' => true,
                'looking_for_french' => true,
                'looking_for_bilingual' => true,
                'first_official_language' => Language::FR->name,
                'estimated_language_ability' => EstimatedLanguageAbility::ADVANCED->name,
                'second_language_exam_completed' => true,
                'second_language_exam_validity' => true,
                'comprehension_level' => EvaluatedLanguageAbility::A->name,
                'written_level' => EvaluatedLanguageAbility::B->name,
                'verbal_level' => EvaluatedLanguageAbility::C->name,
                // Work info
                'work_email' => 'employee@test.com',
                'has_priority_entitlement' => true,
                'priority_number' => '12345',
                'position_duration' => [PositionDuration::PERMANENT->name],
                'accepted_operational_requirements' => [
                    OperationalRequirement::DRIVERS_LICENSE->name,
                    OperationalRequirement::ON_CALL->name,
                    OperationalRequirement::OVERTIME_OCCASIONAL->name,
                ],
                'current_city' => 'The Town',
                'current_province' => ProvinceOrTerritory::ONTARIO->name,
                'location_preferences' => ['NATIONAL_CAPITAL', 'ONTARIO'],
                'flexible_work_locations' => [
                    FlexibleWorkLocation::REMOTE->name,
                    FlexibleWorkLocation::HYBRID->name,
                ],
                'location_exemptions' => 'Gotham City',
                // DEI
                'indigenous_communities' => [
                    IndigenousCommunity::INUIT->name,
                ],
                'is_woman' => true,
                'is_visible_minority' => true,
                'has_disability' => true,
            ]);

        $targetUser->employeeProfile()->update([
            'career_planning_lateral_move_interest' => true,
            'career_planning_lateral_move_time_frame' => TimeFrame::THIS_YEAR->name,
            'career_planning_lateral_move_organization_type' => [
                OrganizationTypeInterest::CURRENT->name,
                OrganizationTypeInterest::LARGE->name,
            ],
            'career_planning_promotion_move_interest' => true,
            'career_planning_promotion_move_time_frame' => TimeFrame::ONE_TO_TWO_YEARS->name,
            'career_planning_promotion_move_organization_type' => [
                OrganizationTypeInterest::SMALL->name,
                OrganizationTypeInterest::MEDIUM->name,
            ],
            'career_planning_learning_opportunities_interest' => [
                LearningOpportunitiesInterest::ACADEMIC_PROGRAM->name,
                LearningOpportunitiesInterest::PEER_NETWORKING->name,
            ],
            'eligible_retirement_year_known' => true,
            'eligible_retirement_year' => Carbon::parse('3001'),
            'career_planning_mentorship_status' => [Mentorship::MENTOR->name],
            'career_planning_mentorship_interest' => [Mentorship::MENTEE->name],
            'career_planning_exec_interest' => true,
            'career_planning_exec_coaching_status' => [ExecCoaching::LEARNING->name],
            'career_planning_exec_coaching_interest' => [ExecCoaching::COACHING->name],
            'career_planning_about_you' => 'Snapshot about my career planning.',
            'career_planning_learning_goals' => 'Snapshot learning goals.',
            'career_planning_work_style' => 'Snapshot career planning work style.',
            'next_role_job_title' => 'My next snapshot role',
            'career_objective_job_title' => 'My career objective role',
            'next_role_additional_information' => 'Additional snapshot information for my next role.',
            'career_objective_additional_information' => 'Additional snapshot information for my career objective.',
            'next_role_community_id' => $community->id,
            'career_objective_community_id' => $community->id,
            'next_role_community_other' => 'Snapshot other community next role',
            'career_objective_community_other' => 'Snapshot other community career objective',
            'next_role_classification_id' => $classification->id,
            'career_objective_classification_id' => $classification->id,
            'next_role_target_role' => TargetRole::ASSISTANT_DEPUTY_MINISTER->name,
            'career_objective_target_role' => TargetRole::DEPUTY_MINISTER->name,
            'next_role_is_c_suite_role' => true,
            'career_objective_is_c_suite_role' => true,
            'next_role_c_suite_role_title' => CSuiteRoleTitle::CHIEF_AUDIT_EXECUTIVE->name,
            'career_objective_c_suite_role_title' => CSuiteRoleTitle::CHIEF_DATA_OFFICER->name,
        ]);

        $targetUser->employeeProfile->nextRoleWorkStreams()->sync([$workStream]);
        $targetUser->employeeProfile->careerObjectiveWorkStreams()->sync([$workStream]);
        $targetUser->employeeProfile->nextRoleDepartments()->sync([$department]);
        $targetUser->employeeProfile->careerObjectiveDepartments()->sync([$department]);

        $targetUser->offPlatformRecruitmentProcesses()->delete();
        OffPlatformRecruitmentProcess::factory()
            ->for($targetUser)
            ->for($department)
            ->for($classification)
            ->create([
                'process_number' => '12345',
                'platform' => HiringPlatform::GC_JOBS->name,
            ]);

        $targetUser->workExperiences()->delete();

        $exp = WorkExperience::factory()
            ->for($targetUser)
            ->for($classification)
            ->for($department)
            ->asSubstantive()
            ->create([
                'role' => 'Deterministic Analyst',
                'organization' => 'Treasury Board',
                'division' => 'Analysis Division',
                'start_date' => '2020-01-01',
                'details' => 'Did deterministic testing of policy.',
                'supervisory_position' => true,
                'supervised_employees' => true,
                'supervised_employees_number' => 19,
                'budget_management' => true,
                'annual_budget_allocation' => 1000,
                'senior_management_status' => true,
                'c_suite_role_title' => CSuiteRoleTitle::CHIEF_DIGITAL_OFFICER->name,
                'other_c_suite_role_title' => null,
            ]);
        $exp->workStreams()->sync([$workStream]);

        $skills = collect(range(1, 4))->map(function ($index) {
            return Skill::factory()->create([
                'name' => [
                    'en' => "Skill $index EN",
                    'fr' => "Skill $index FR",
                ],
            ]);
        });

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
