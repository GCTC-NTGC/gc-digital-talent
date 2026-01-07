<?php

namespace Tests\Feature\Notifications;

use App\Enums\CafEmploymentType;
use App\Enums\CafForce;
use App\Enums\CafRank;
use App\Enums\EmploymentCategory;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\Notification;
use App\Models\PersonalExperience;
use App\Models\User;
use App\Models\WorkExperience;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\Concerns\InteractsWithExceptionHandling;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

class TriggerGovernmentExperienceVerifyEmailTest extends TestCase
{
    use InteractsWithExceptionHandling;
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $user;

    protected $department;

    protected $classification;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()
            ->asApplicant()
            ->create([
                'work_email_verified_at' => null,
            ]);

        $this->department = Department::factory()->create();

        $this->classification = Classification::factory()->create();

        Notification::truncate();
    }

    // test notification correctly created via mutation
    // government work experience, indeterminate, null end date
    public function testGovernmentWorkExperienceVerifyWorkEmailNotificationMutationSuccessful(): void
    {
        assertEquals(0, count(Notification::all()));

        $this->actingAs($this->user, 'api')->graphQL(
            /** @lang GraphQL */
            '
        mutation createWorkExperience($userId: ID!, $workExperience: WorkExperienceInput!) {
            createWorkExperience(userId: $userId, workExperience: $workExperience) {
                user {
                    id
                }
            }
        }
        ',
            [
                'userId' => $this->user->id,
                'workExperience' => [
                    'employmentCategory' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                    'govEmploymentType' => GovEmployeeType::INDETERMINATE->name,
                    'govPositionType' => GovPositionType::ACTING->name,
                    'classificationId' => $this->classification->id,
                    'department' => ['connect' => $this->department->id],
                    'startDate' => config('constants.past_date'),
                    'endDate' => null,
                ],
            ]
        )->assertJsonFragment(
            [
                'user' => [
                    'id' => $this->user->id,
                ],
            ],
        );

        // only one notification was sent
        $notifications = Notification::all();
        assertEquals(1, count($notifications));

        // created notification was to the expected user
        assertEquals($this->user->id, $notifications[0]->notifiable_id);
    }

    // test other cases that should send notifications
    public function testGovernmentWorkExperienceVerifyWorkEmailNotificationOtherCasesSuccessful(): void
    {
        assertEquals(0, count(Notification::all()));

        // indeterminate with future end date
        WorkExperience::factory()->create([
            'user_id' => $this->user->id,
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::ACTING->name,
            'classification_id' => $this->classification->id,
            'department_id' => $this->department->id,
            'start_date' => config('constants.past_date'),
            'end_date' => config('constants.far_future_date'),
        ]);

        // term with required future end date
        WorkExperience::factory()->create([
            'user_id' => $this->user->id,
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::TERM->name,
            'classification_id' => $this->classification->id,
            'department_id' => $this->department->id,
            'start_date' => config('constants.past_date'),
            'end_date' => config('constants.far_future_date'),
        ]);

        // two notifications sent, one per experience
        $notifications = Notification::all();
        assertEquals(2, count($notifications));
    }

    // other experiences being created don't send notifications
    public function testNonWorkExperienceNoNotifications(): void
    {
        assertEquals(0, count(Notification::all()));

        AwardExperience::factory()->create([
            'user_id' => $this->user->id,
        ]);

        CommunityInterest::factory()->create([
            'user_id' => $this->user->id,
        ]);

        EducationExperience::factory()->create([
            'user_id' => $this->user->id,
        ]);

        PersonalExperience::factory()->create([
            'user_id' => $this->user->id,
        ]);

        // no notifications sent
        $notifications = Notification::all();
        assertEquals(0, count($notifications));
    }

    // test other cases like external or army experiences don't send notifications
    public function testExcludedWorkExperienceNoNotifications(): void
    {
        assertEquals(0, count(Notification::all()));

        // external
        WorkExperience::factory()->create([
            'user_id' => $this->user->id,
            'employment_category' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
            'ext_size_of_organization' => ExternalSizeOfOrganization::ONE_HUNDRED_ONE_TO_ONE_THOUSAND->name,
            'ext_role_seniority' => ExternalRoleSeniority::INTERMEDIATE->name,
        ]);

        // armed forces
        WorkExperience::factory()->create([
            'user_id' => $this->user->id,
            'employment_category' => EmploymentCategory::CANADIAN_ARMED_FORCES->name,
            'caf_employment_type' => CafEmploymentType::REGULAR_FORCE->name,
            'caf_force' => CafForce::ROYAL_CANADIAN_AIR_FORCE->name,
            'caf_rank' => CafRank::GENERAL_FLAG_OFFICER->name,
        ]);

        // past experience, not current
        WorkExperience::factory()->create([
            'user_id' => $this->user->id,
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::ACTING->name,
            'classification_id' => $this->classification->id,
            'department_id' => $this->department->id,
            'start_date' => config('constants.past_date'),
            'end_date' => config('constants.past_date'),
        ]);

        // no notifications sent
        $notifications = Notification::all();
        assertEquals(0, count($notifications));
    }

    // test verified work email prevents sending of notifications when they would've otherwise been sent
    public function testVerifiedWorkEmailNoNotifications(): void
    {
        $userVerifiedEmail = User::factory()
            ->asApplicant()
            ->create([
                'work_email_verified_at' => config('constants.past_date'),
            ]);

        Notification::truncate();
        assertEquals(0, count(Notification::all()));

        // indeterminate with future end date
        WorkExperience::factory()->create([
            'user_id' => $userVerifiedEmail->id,
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::INDETERMINATE->name,
            'gov_position_type' => GovPositionType::ACTING->name,
            'classification_id' => $this->classification->id,
            'department_id' => $this->department->id,
            'start_date' => config('constants.past_date'),
            'end_date' => config('constants.far_future_date'),
        ]);

        // term with required future end date
        WorkExperience::factory()->create([
            'user_id' => $userVerifiedEmail->id,
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            'gov_employment_type' => GovEmployeeType::TERM->name,
            'classification_id' => $this->classification->id,
            'department_id' => $this->department->id,
            'start_date' => config('constants.past_date'),
            'end_date' => config('constants.far_future_date'),
        ]);

        // no notifications sent
        $notifications = Notification::all();
        assertEquals(0, count($notifications));
    }
}
