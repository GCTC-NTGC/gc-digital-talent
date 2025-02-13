<?php

namespace Tests\Feature;

use App\Enums\ExecCoaching;
use App\Enums\Mentorship;
use App\Enums\MoveInterest;
use App\Enums\OrganizationTypeInterest;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\User;
use App\Models\WorkStream;
use Database\Helpers\ApiErrorEnums;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

class EmployeeProfileTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesUnprotectedGraphqlEndpoint;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([RolePermissionSeeder::class, DepartmentSeeder::class]);

        $this->user = User::factory()
            ->asApplicant()
            ->withEmployeeProfile()
            ->create();
    }

    public function testCanViewEmployeeProfile()
    {

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                query {
                    me {
                        employeeProfile {
                            organizationTypeInterest { value }
                            moveInterest { value }
                            mentorshipStatus { value }
                            mentorshipInterest { value }
                            execInterest
                            execCoachingStatus { value }
                            execCoachingInterest { value }
                            dreamRoleTitle
                            dreamRoleAdditionalInformation
                            dreamRoleClassification { id }
                            dreamRoleCommunity { id }
                            dreamRoleWorkStream { id }
                            dreamRoleDepartments { id }
                            aboutYou
                            learningGoals
                            workStyle
                        }
                    }
                }
                GRAPHQL)
            ->assertJsonFragment([
                'organizationTypeInterest' => $this->arrayToLocalizedEnum($this->user->employeeProfile->career_planning_organization_type_interest),
                'moveInterest' => $this->arrayToLocalizedEnum($this->user->employeeProfile->career_planning_move_interest),
                'mentorshipStatus' => $this->arrayToLocalizedEnum($this->user->employeeProfile->career_planning_mentorship_status),
                'mentorshipInterest' => $this->arrayToLocalizedEnum($this->user->employeeProfile->career_planning_mentorship_interest),
                'execInterest' => $this->user->employeeProfile->career_planning_exec_interest,
                'execCoachingStatus' => $this->arrayToLocalizedEnum($this->user->employeeProfile->career_planning_exec_coaching_status),
                'execCoachingInterest' => $this->arrayToLocalizedEnum($this->user->employeeProfile->career_planning_exec_coaching_interest),
                'dreamRoleTitle' => $this->user->employeeProfile->dream_role_title,
                'dreamRoleAdditionalInformation' => $this->user->employeeProfile->dream_role_additional_information,
                'dreamRoleClassification' => ['id' => $this->user->employeeProfile->dreamRoleClassification->id],
                'dreamRoleCommunity' => ['id' => $this->user->employeeProfile->dreamRoleCommunity->id],
                'dreamRoleWorkStream' => ['id' => $this->user->employeeProfile->dreamRoleWorkStream->id],
                'dreamRoleDepartments' => Arr::map($this->user->employeeProfile->dreamRoleDepartments->toArray(), fn ($value) => ['id' => $value['id']]),
                'aboutYou' => $this->user->employeeProfile->career_planning_about_you,
                'learningGoals' => $this->user->employeeProfile->career_planning_learning_goals,
                'workStyle' => $this->user->employeeProfile->career_planning_work_style,
            ]);
    }

    public function testCanUpdateEmployeeProfile()
    {

        $community = Community::factory()->withWorkStreams()->create();
        $input = [
            'organizationTypeInterest' => [OrganizationTypeInterest::CURRENT->name],
            'moveInterest' => [MoveInterest::AT_LEVEL->name],
            'mentorshipStatus' => [Mentorship::MENTOR->name],
            'mentorshipInterest' => array_column(Mentorship::cases(), 'name'),
            'execInterest' => true,
            'execCoachingStatus' => null,
            'execCoachingInterest' => [ExecCoaching::LEARNING->name],
            'dreamRoleTitle' => 'test dream role',
            'dreamRoleAdditionalInformation' => 'test additional information',
            'dreamRoleClassification' => ['connect' => Classification::factory()->create()->id],
            'dreamRoleCommunity' => ['connect' => $community->id],
            'dreamRoleWorkStream' => ['connect' => $community->workStreams->first()->id],
            'dreamRoleDepartments' => ['sync' => [Department::factory()->create()->id]],
            'aboutYou' => 'test about',
            'learningGoals' => 'test learningGoals',
            'workStyle' => 'test workStyle',
        ];

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateEmployeeProfile($id: UUID!, $employeeProfile: UpdateEmployeeProfileInput!) {
                    updateEmployeeProfile(id: $id, employeeProfile: $employeeProfile) {
                            organizationTypeInterest { value }
                            moveInterest { value }
                            mentorshipStatus { value }
                            mentorshipInterest { value }
                            execInterest
                            execCoachingStatus { value }
                            execCoachingInterest { value }
                            dreamRoleTitle
                            dreamRoleAdditionalInformation
                            dreamRoleClassification { id }
                            dreamRoleCommunity { id }
                            dreamRoleWorkStream { id }
                            dreamRoleDepartments { id }
                            aboutYou
                            learningGoals
                        workStyle
                    }
                }
                GRAPHQL, ['id' => $this->user->id, 'employeeProfile' => $input])->assertJsonFragment([
                'organizationTypeInterest' => $this->arrayToLocalizedEnum($input['organizationTypeInterest']),
                'moveInterest' => $this->arrayToLocalizedEnum($input['moveInterest']),
                'mentorshipStatus' => $this->arrayToLocalizedEnum($input['mentorshipStatus']),
                'mentorshipInterest' => $this->arrayToLocalizedEnum($input['mentorshipInterest']),
                'execInterest' => $input['execInterest'],
                'execCoachingStatus' => $this->arrayToLocalizedEnum($input['execCoachingStatus']),
                'execCoachingInterest' => $this->arrayToLocalizedEnum($input['execCoachingInterest']),
                'dreamRoleTitle' => $input['dreamRoleTitle'],
                'dreamRoleAdditionalInformation' => $input['dreamRoleAdditionalInformation'],
                'dreamRoleClassification' => ['id' => $input['dreamRoleClassification']['connect']],
                'dreamRoleCommunity' => ['id' => $input['dreamRoleCommunity']['connect']],
                'dreamRoleWorkStream' => ['id' => $input['dreamRoleWorkStream']['connect']],
                'dreamRoleDepartments' => [['id' => $input['dreamRoleDepartments']['sync'][0]]],
                'aboutYou' => $input['aboutYou'],
                'learningGoals' => $input['learningGoals'],
                'workStyle' => $input['workStyle'],
            ]);
    }

    public function testUpdateEmployeeProfileBadInputFailsValidation()
    {

        $unassociatedWorkStream = WorkStream::factory()->create();
        $community = Community::factory()->withWorkStreams()->create();
        $input = [
            'dreamRoleClassification' => ['connect' => Str::uuid()],
            'dreamRoleCommunity' => ['connect' => $community->id],
            'dreamRoleWorkStream' => ['connect' => $unassociatedWorkStream->id],
            'dreamRoleDepartments' => ['sync' => [Str::uuid()]],
        ];

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateEmployeeProfile($id: UUID!, $employeeProfile: UpdateEmployeeProfileInput!) {
                    updateEmployeeProfile(id: $id, employeeProfile: $employeeProfile) {
                        userPublicProfile { email }
                    }
                }
                GRAPHQL,
                [
                    'id' => $this->user->id,
                    'employeeProfile' => $input,
                ])
            ->assertGraphQLValidationError('employeeProfile.dreamRoleClassification.connect', ApiErrorEnums::CLASSIFICATION_NOT_FOUND)
            ->assertGraphQLValidationError('employeeProfile.dreamRoleWorkStream.connect', ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY)
            ->assertGraphQLValidationError('employeeProfile.dreamRoleDepartments.sync.0', ApiErrorEnums::DEPARTMENT_NOT_FOUND);
    }

    public function testCannotEditAnotherUsersEmployeeProfile()
    {
        /** @var \App\Models\User $otherUser */
        $otherUser = User::factory()->create();

        $this->actingAs($otherUser, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateOtherUserEmployeeProfile($id: UUID!, $employeeProfile: UpdateEmployeeProfileInput!) {
                    updateEmployeeProfile(id: $id, employeeProfile: $employeeProfile) {
                        dreamRoleTitle
                    }
                }
            GRAPHQL, [
                'id' => $this->user->id,
                'employeeProfile' => ['dreamRoleTitle' => 'test'],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    protected function arrayToLocalizedEnum(?array $arr)
    {
        return ! is_null($arr) ? Arr::map($arr, fn ($value) => ['value' => $value]) : null;
    }
}
