<?php

namespace Tests\Feature;

use App\Enums\ExecCoaching;
use App\Enums\Mentorship;
use App\Enums\MoveInterest;
use App\Enums\OrganizationTypeInterest;
use App\Enums\TargetRole;
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
                            nextRoleJobTitle
                            careerObjectiveJobTitle
                            nextRoleAdditionalInformation
                            careerObjectiveAdditionalInformation
                            nextRoleClassification { id }
                            careerObjectiveClassification { id }
                            nextRoleCommunity { id }
                            careerObjectiveCommunity { id }
                            nextRoleCommunityOther
                            careerObjectiveCommunityOther
                            nextRoleWorkStreams { id }
                            careerObjectiveWorkStreams { id }
                            nextRoleDepartments { id }
                            careerObjectiveDepartments { id }
                            nextRoleTargetRole { value }
                            careerObjectiveTargetRole { value }
                            nextRoleTargetRoleOther
                            careerObjectiveTargetRoleOther
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
                'nextRoleJobTitle' => $this->user->employeeProfile->next_role_job_title,
                'careerObjectiveJobTitle' => $this->user->employeeProfile->career_objective_job_title,
                'nextRoleAdditionalInformation' => $this->user->employeeProfile->next_role_additional_information,
                'careerObjectiveAdditionalInformation' => $this->user->employeeProfile->career_objective_additional_information,
                'nextRoleClassification' => ['id' => $this->user->employeeProfile->nextRoleClassification?->id],
                'careerObjectiveClassification' => ['id' => $this->user->employeeProfile->careerObjectiveClassification?->id],
                'nextRoleCommunity' => $this->user->employeeProfile->nextRoleCommunity?->id ?
                    ['id' => $this->user->employeeProfile->nextRoleCommunity->id] : null,
                'careerObjectiveCommunity' => $this->user->employeeProfile->careerObjectiveCommunity?->id ?
                    ['id' => $this->user->employeeProfile->careerObjectiveCommunity->id] : null,
                'nextRoleCommunityOther' => $this->user->employeeProfile->next_role_community_other,
                'careerObjectiveCommunityOther' => $this->user->employeeProfile->career_objective_community_other,
                'nextRoleWorkStreams' => Arr::map($this->user->employeeProfile->nextRoleWorkStreams->toArray(), fn ($value) => ['id' => $value['id']]),
                'careerObjectiveWorkStreams' => Arr::map($this->user->employeeProfile->careerObjectiveWorkStreams->toArray(), fn ($value) => ['id' => $value['id']]),
                'nextRoleDepartments' => Arr::map($this->user->employeeProfile->nextRoleDepartments->toArray(), fn ($value) => ['id' => $value['id']]),
                'careerObjectiveDepartments' => Arr::map($this->user->employeeProfile->careerObjectiveDepartments->toArray(), fn ($value) => ['id' => $value['id']]),
                'nextRoleTargetRole' => ['value' => $this->user->employeeProfile->next_role_target_role],
                'careerObjectiveTargetRole' => ['value' => $this->user->employeeProfile->career_objective_target_role],
                'nextRoleTargetRoleOther' => $this->user->employeeProfile->next_role_target_role_other,
                'careerObjectiveTargetRoleOther' => $this->user->employeeProfile->career_objective_target_role_other,
                'aboutYou' => $this->user->employeeProfile->career_planning_about_you,
                'learningGoals' => $this->user->employeeProfile->career_planning_learning_goals,
                'workStyle' => $this->user->employeeProfile->career_planning_work_style,
            ]);
    }

    public function testCanUpdateEmployeeProfile()
    {

        $nextRoleCommunity = Community::factory()->withWorkStreams()->create();
        $careerObjectiveCommunity = Community::factory()->withWorkStreams()->create();
        $input = [
            'organizationTypeInterest' => [OrganizationTypeInterest::CURRENT->name],
            'moveInterest' => [MoveInterest::AT_LEVEL->name],
            'mentorshipStatus' => [Mentorship::MENTOR->name],
            'mentorshipInterest' => array_column(Mentorship::cases(), 'name'),
            'execInterest' => true,
            'execCoachingStatus' => null,
            'execCoachingInterest' => [ExecCoaching::LEARNING->name],
            'nextRoleJobTitle' => 'test next role job title',
            'careerObjectiveJobTitle' => 'test career objective job title',
            'nextRoleAdditionalInformation' => 'next role additional information',
            'careerObjectiveAdditionalInformation' => 'career objective additional information',
            'nextRoleClassification' => ['connect' => Classification::factory()->create()->id],
            'careerObjectiveClassification' => ['connect' => Classification::factory()->create()->id],
            'nextRoleCommunity' => ['connect' => $nextRoleCommunity->id],
            'careerObjectiveCommunity' => ['connect' => $careerObjectiveCommunity->id],
            'nextRoleCommunityOther' => null,
            'careerObjectiveCommunityOther' => null,
            'nextRoleWorkStreams' => ['sync' => [$nextRoleCommunity->workStreams->first()->id]],
            'careerObjectiveWorkStreams' => ['sync' => [$careerObjectiveCommunity->workStreams->first()->id]],
            'nextRoleDepartments' => ['sync' => [Department::factory()->create()->id]],
            'careerObjectiveDepartments' => ['sync' => [Department::factory()->create()->id]],
            'nextRoleTargetRole' => TargetRole::INDIVIDUAL_CONTRIBUTOR->name,
            'nextRoleTargetRoleOther' => null,
            'careerObjectiveTargetRole' => TargetRole::OTHER->name,
            'careerObjectiveTargetRoleOther' => 'test other',
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
                            nextRoleJobTitle
                            careerObjectiveJobTitle
                            nextRoleAdditionalInformation
                            careerObjectiveAdditionalInformation
                            nextRoleClassification { id }
                            careerObjectiveClassification { id }
                            nextRoleCommunity { id }
                            careerObjectiveCommunity { id }
                            nextRoleCommunityOther
                            careerObjectiveCommunityOther
                            nextRoleWorkStreams { id }
                            careerObjectiveWorkStreams { id }
                            nextRoleDepartments { id }
                            careerObjectiveDepartments { id }
                            nextRoleTargetRole { value }
                            nextRoleTargetRoleOther
                            careerObjectiveTargetRole { value }
                            careerObjectiveTargetRoleOther
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
                'nextRoleJobTitle' => $input['nextRoleJobTitle'],
                'careerObjectiveJobTitle' => $input['careerObjectiveJobTitle'],
                'nextRoleAdditionalInformation' => $input['nextRoleAdditionalInformation'],
                'careerObjectiveAdditionalInformation' => $input['careerObjectiveAdditionalInformation'],
                'nextRoleClassification' => ['id' => $input['nextRoleClassification']['connect']],
                'careerObjectiveClassification' => ['id' => $input['careerObjectiveClassification']['connect']],
                'nextRoleCommunity' => ['id' => $input['nextRoleCommunity']['connect']],
                'careerObjectiveCommunity' => ['id' => $input['careerObjectiveCommunity']['connect']],
                'nextRoleCommunityOther' => null,
                'careerObjectiveCommunityOther' => null,
                'nextRoleWorkStreams' => [['id' => $input['nextRoleWorkStreams']['sync'][0]]],
                'careerObjectiveWorkStreams' => [['id' => $input['careerObjectiveWorkStreams']['sync'][0]]],
                'nextRoleDepartments' => [['id' => $input['nextRoleDepartments']['sync'][0]]],
                'careerObjectiveDepartments' => [['id' => $input['careerObjectiveDepartments']['sync'][0]]],
                'nextRoleTargetRole' => ['value' => $input['nextRoleTargetRole']],
                'nextRoleTargetRoleOther' => $input['nextRoleTargetRoleOther'],
                'careerObjectiveTargetRole' => ['value' => $input['careerObjectiveTargetRole']],
                'careerObjectiveTargetRoleOther' => $input['careerObjectiveTargetRoleOther'],
                'aboutYou' => $input['aboutYou'],
                'learningGoals' => $input['learningGoals'],
                'workStyle' => $input['workStyle'],
            ]);
    }

    public function testUpdateEmployeeProfileBadInputFailsValidation()
    {

        $unassociatedWorkStream = WorkStream::factory()->create();
        $nextRoleCommunity = Community::factory()->withWorkStreams()->create();
        $careerObjectiveCommunity = Community::factory()->withWorkStreams()->create();
        $input = [
            'nextRoleClassification' => ['connect' => Str::uuid()],
            'careerObjectiveClassification' => ['connect' => Str::uuid()],
            'nextRoleCommunity' => ['connect' => $nextRoleCommunity->id],
            'careerObjectiveCommunity' => ['connect' => $careerObjectiveCommunity->id],
            'nextRoleWorkStreams' => ['sync' => [$unassociatedWorkStream->id]],
            'careerObjectiveWorkStreams' => ['sync' => [$unassociatedWorkStream->id]],
            'nextRoleDepartments' => ['sync' => [Str::uuid()]],
            'careerObjectiveDepartments' => ['sync' => [Str::uuid()]],
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
            ->assertGraphQLValidationError('employeeProfile.nextRoleClassification.connect', ApiErrorEnums::CLASSIFICATION_NOT_FOUND)
            ->assertGraphQLValidationError('employeeProfile.careerObjectiveClassification.connect', ApiErrorEnums::CLASSIFICATION_NOT_FOUND)
            ->assertGraphQLValidationError('employeeProfile.nextRoleWorkStreams.sync.0', ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY)
            ->assertGraphQLValidationError('employeeProfile.careerObjectiveWorkStreams.sync.0', ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY)
            ->assertGraphQLValidationError('employeeProfile.nextRoleDepartments.sync.0', ApiErrorEnums::DEPARTMENT_NOT_FOUND)
            ->assertGraphQLValidationError('employeeProfile.careerObjectiveDepartments.sync.0', ApiErrorEnums::DEPARTMENT_NOT_FOUND);
    }

    public function testUpdateEmployeeProfileCommunityOtherCommunityValidation()
    {
        $nextRoleCommunity = Community::factory()->withWorkStreams()->create();
        $careerObjectiveCommunity = Community::factory()->withWorkStreams()->create();
        $input = [
            'nextRoleCommunity' => ['connect' => $nextRoleCommunity->id],
            'careerObjectiveCommunity' => ['connect' => $careerObjectiveCommunity->id],
            'nextRoleCommunityOther' => 'Imaginary community',
            'careerObjectiveCommunityOther' => 'Imaginary community',
            'nextRoleWorkStreams' => ['sync' => [$nextRoleCommunity->workStreams->first()->id]],
            'careerObjectiveWorkStreams' => ['sync' => [$careerObjectiveCommunity->workStreams->first()->id]],
        ];
        $input2 = [
            'nextRoleCommunity' => ['connect' => $nextRoleCommunity->id],
            'careerObjectiveCommunity' => ['connect' => null],
            'nextRoleCommunityOther' => null,
            'careerObjectiveCommunityOther' => 'Imaginary community',
            'nextRoleWorkStreams' => ['sync' => [$nextRoleCommunity->workStreams->first()->id]],
            'careerObjectiveWorkStreams' => ['sync' => []],
        ];

        // fails due to passing in community and community other values, check validation errors present
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
            ->assertGraphQLValidationError('employeeProfile.nextRoleCommunity.connect', 'The employee profile.next role community.connect field is prohibited.')
            ->assertGraphQLValidationError('employeeProfile.careerObjectiveCommunity.connect', 'The employee profile.career objective community.connect field is prohibited.')
            ->assertGraphQLValidationError('employeeProfile.nextRoleCommunityOther', 'The employee profile.next role community other field is prohibited.')
            ->assertGraphQLValidationError('employeeProfile.careerObjectiveCommunityOther', 'The employee profile.career objective community other field is prohibited.')
            ->assertGraphQLValidationError('employeeProfile.nextRoleWorkStreams.sync.0', 'The employeeProfile.nextRoleWorkStreams.sync.0 field is prohibited.')
            ->assertGraphQLValidationError('employeeProfile.careerObjectiveWorkStreams.sync.0', 'The employeeProfile.careerObjectiveWorkStreams.sync.0 field is prohibited.');

        // mutation successful now with the second input
        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateEmployeeProfile($id: UUID!, $employeeProfile: UpdateEmployeeProfileInput!) {
                    updateEmployeeProfile(id: $id, employeeProfile: $employeeProfile) {
                        userPublicProfile { email }
                        nextRoleCommunityOther
                        careerObjectiveCommunityOther
                    }
                }
                GRAPHQL,
                [
                    'id' => $this->user->id,
                    'employeeProfile' => $input2,
                ])
            ->assertJsonFragment(['nextRoleCommunityOther' => null])
            ->assertJsonFragment(['careerObjectiveCommunityOther' => 'Imaginary community']);
    }

    public function testCannotEditAnotherUsersEmployeeProfile()
    {
        /** @var \App\Models\User $otherUser */
        $otherUser = User::factory()->create();

        $this->actingAs($otherUser, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateOtherUserEmployeeProfile($id: UUID!, $employeeProfile: UpdateEmployeeProfileInput!) {
                    updateEmployeeProfile(id: $id, employeeProfile: $employeeProfile) {
                        nextRoleAdditionalInformation
                    }
                }
            GRAPHQL, [
                'id' => $this->user->id,
                'employeeProfile' => [
                    'nextRoleAdditionalInformation' => 'next role additional information',
                ],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    protected function arrayToLocalizedEnum(?array $arr)
    {
        return ! is_null($arr) ? Arr::map($arr, fn ($value) => ['value' => $value]) : null;
    }
}
