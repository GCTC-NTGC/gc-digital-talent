<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Enums\IndigenousCommunity;
use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PositionDuration;
use App\Enums\WfaInterest;
use App\Enums\WorkRegion;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class EmployeeWFATest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $admin;

    protected User $employee;

    protected Community $community;

    protected $query = <<<'GRAPHQL'
    query EmployeeWFA($where: EmployeeWfaFilterInput) {
        employeeWFAPaginatedAdminTable(where: $where) {
            data {
                id
                employeeWFA {
                    wfaInterest { value }
                    wfaDate
                    wfaUpdatedAt
                }
            }
            paginatorInfo {
                total
            }
        }
    }
    GRAPHQL;

    protected $userQuery = <<<'GRAPHQL'
    query User($id: UUID!) {
        user(id: $id) {
            employeeWFA { wfaInterest { value } }
        }
    }
    GRAPHQL;

    protected $mutation = <<<'GRAPHQL'
    mutation UpdateEmployeeWFA($id: UUID!, $employeeWFA: UpdateEmployeeWFAInput!) {
        updateEmployeeWFA(id: $id, employeeWFA: $employeeWFA) {
            id
            wfaInterest { value }
            wfaDate
            wfaUpdatedAt
        }
    }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->admin = User::factory()
            ->asAdmin()
            ->create();

        $this->community = Community::factory()->create();

        $this->employee = User::factory()
            ->asApplicant()
            ->withCommunityInterests([$this->community->id])
            ->asGovEmployee()
            ->create();
    }

    public function testUserCanUpdateOwnWfa()
    {
        $futureDate = config('constants.far_future_date');
        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'wfaInterest' => WfaInterest::LETTER_RECEIVED->name,
                    'wfaDate' => $futureDate,
                ],
            ])->assertJsonFragment([
                'wfaInterest' => [
                    'value' => WfaInterest::LETTER_RECEIVED->name,
                ],
                'wfaDate' => $futureDate,
            ]);
    }

    public function testUserCannotUpdateWithZeroSubstantiveExperiences()
    {
        $user = User::factory()->asApplicant()->create();

        $this->actingAs($user, 'api')
            ->graphQL($this->mutation, [
                'id' => $user->id,
                'employeeWFA' => [
                    'wfaInterest' => WfaInterest::LETTER_RECEIVED->name,
                ],
            ])->assertGraphQLValidationError('id', ErrorCode::MISSING_SUBSTANTIVE_EXPERIENCE->name);
    }

    public function testUserCanUpdateToNotApplicableWithZeroSubstantiveExperiences()
    {
        $user = User::factory()->asApplicant()->create();

        $this->actingAs($user, 'api')
            ->graphQL($this->mutation, [
                'id' => $user->id,
                'employeeWFA' => [
                    'wfaInterest' => WfaInterest::NOT_APPLICABLE->name,
                ],
            ])->assertJsonFragment([
                'wfaInterest' => [
                    'value' => WfaInterest::NOT_APPLICABLE->name,
                ],
            ]);
    }

    public function testUserCannotUpdateWithMoreThanOneSubstantiveExperiences()
    {
        $user = User::factory()->asApplicant()->create();

        WorkExperience::factory(2)
            ->asSubstantive()
            ->create([
                'user_id' => $user->id,
            ]);

        $this->actingAs($user, 'api')
            ->graphQL($this->mutation, [
                'id' => $user->id,
                'employeeWFA' => [
                    'wfaInterest' => WfaInterest::LETTER_RECEIVED->name,
                ],
            ])->assertGraphQLValidationError('id', ErrorCode::TOO_MANY_SUBSTANTIVE_EXPERIENCES->name);
    }

    public function testUpdatedAtSet()
    {
        // Mock date we expect to get after saving
        $nowInUtc = '2999-12-28 20:00:00';
        Carbon::setTestNow($nowInUtc);

        // Ensure interest is different
        $this->employee->wfa_interest = WfaInterest::NOT_SURE->name;
        $this->employee->save();

        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'wfaInterest' => WfaInterest::VOLUNTARY_DEPARTURE->name,
                ],
            ])->assertJsonFragment([
                'wfaUpdatedAt' => $nowInUtc,
            ]);
    }

    public function testNotApplicableSetsDateToNull()
    {
        // Ensure we have a date to being with
        $this->employee->wfa_date = config('constants.far_future_date');
        $this->employee->save();

        $this->actingAs($this->employee, 'api')
            ->graphQL($this->mutation, [
                'id' => $this->employee->id,
                'employeeWFA' => [
                    'wfaInterest' => null,
                ],
            ])->assertJsonFragment(['wfaDate' => null]);
    }

    public function testPlatformAdminCanViewAny()
    {
        $admin = User::factory()
            ->asAdmin()
            ->create();

        $this->actingAs($admin, 'api')
            ->graphQL($this->query)
            ->assertJsonFragment(['id' => $this->employee->id]);
    }

    public function testCommunityRecruiterCanViewInCommunity()
    {
        // Unrelated user who should not appear
        User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->create();

        $recruiter = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create();

        $pool = Pool::factory()
            ->published()
            ->create(['community_id' => $this->community->id]);

        // No community interest but will apply to pool
        $user = User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->create();

        PoolCandidate::factory()
            ->availableInSearch()
            ->create([
                'pool_id' => $pool->id,
                'user_id' => $user->id,
                'submitted_at' => config('constants.past_datetime'),
            ]);

        $res = $this->actingAs($recruiter, 'api')
            ->graphQL($this->query);

        $results = $res->json('data.employeeWFAPaginatedAdminTable.data');
        // Expect 1 users, filters out unrelated communities and those who have applied to community process
        $this->assertCount(1, $results);
    }

    public function testCommunityRecruiterCannotViewOutsideCommunity()
    {
        // No community interest but will apply to pool
        $user = User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->create();

        $pool = Pool::factory()
            ->published()
            ->create(['community_id' => $this->community->id]);

        PoolCandidate::factory()
            ->availableInSearch()
            ->create([
                'pool_id' => $pool->id,
                'user_id' => $user->id,
                'submitted_at' => config('constants.past_datetime'),
            ]);

        // Unrelated community
        $community = Community::factory()->create();

        $recruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();

        $res = $this->actingAs($recruiter, 'api')
            ->graphQL($this->query);

        $results = $res->json('data.employeeWFAPaginatedAdminTable.data');
        // Expect 0 users since this user is not part of any related communities
        $this->assertCount(0, $results);
    }

    public function testCommunityRecruiterCannotQueryEmployeeWfaOutsideCommunity()
    {
        // Unrelated community
        $community = Community::factory()->create();

        $recruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();

        $this->actingAs($recruiter, 'api')
            ->graphQL($this->userQuery, ['id' => $this->employee->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCommunityRecruiterCanViewSpecificUserInCommunity()
    {
        $recruiter = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create();

        $this->actingAs($recruiter, 'api')
            ->graphQL($this->userQuery, ['id' => $this->employee->id])
            ->assertJsonFragment(['employeeWFA' => ['wfaInterest' => ['value' => $this->employee->wfa_interest]]]);
    }

    public function testPlatformAdminCanViewSpecificUser()
    {
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->userQuery, ['id' => $this->employee->id])
            ->assertJsonFragment(['employeeWFA' => ['wfaInterest' => ['value' => $this->employee->wfa_interest]]]);
    }

    public function testEquityFilter()
    {
        // Loose user who should not appear
        User::factory()
            ->asApplicant()
            ->asGovEmployee()
            ->create([
                'is_woman' => false,
                'is_visible_minority' => false,
                'has_disability' => false,
                'indigenous_communities' => [],
            ]);

        $this->employee->is_woman = true;
        $this->employee->is_visible_minority = true;
        $this->employee->has_disability = true;
        $this->employee->indigenous_communities = [IndigenousCommunity::INUIT->name];
        $this->employee->save();

        $this->admin->is_woman = false;
        $this->admin->is_visible_minority = false;
        $this->admin->has_disability = false;
        $this->admin->indigenous_communities = [];
        $this->admin->save();

        // Woman
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'equity' => [
                        'isWoman' => true,
                    ],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);

        // Minority
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'equity' => [
                        'isVisibleMinority' => true,
                    ],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);

        // Disabled
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'equity' => [
                        'hasDisability' => true,
                    ],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);

        // Indigenous
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'equity' => [
                        'isIndigenous' => true,
                    ],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);

        // All at once
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'equity' => [
                        'isWoman' => true,
                        'isVisibleMinority' => true,
                        'hasDisability' => true,
                        'isIndigenous' => true,
                    ],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);
    }

    public function testClassificationsFilter()
    {
        $classification = Classification::factory()->create();

        $this->employee->computed_classification = $classification->id;
        $this->employee->save();

        $this->admin->computed_classification = null;
        $this->admin->save();

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'classifications' => [['id' => $classification->id]],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);
    }

    public function testDepartmentsFilter()
    {
        $dept = Department::factory()->create();

        $this->employee->computed_department = $dept->id;
        $this->employee->save();

        $this->admin->computed_department = null;
        $this->admin->save();

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'departments' => [['id' => $dept->id]],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);
    }

    public function testSkillsFilter()
    {
        $skill = Skill::factory()->create();

        UserSkill::factory()
            ->create([
                'user_id' => $this->employee->id,
                'skill_id' => $skill->id,
            ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'skills' => [['id' => $skill->id]],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);
    }

    public function testWorkStreamsFilter()
    {
        $community = Community::factory()
            ->withWorkStreams()
            ->create();
        $interest = CommunityInterest::factory()
            ->withWorkStreams()
            ->create([
                'community_id' => $community->id,
                'user_id' => $this->employee->id,
            ]);

        $stream = $interest->workStreams()->first();

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'workStreams' => [['id' => $stream->id]],
                ],
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);
    }

    /**
     * @dataProvider queryFiltersProvider
     */
    public function testQueryFilters($filter, $admin, $employee)
    {
        foreach ($admin as $k => $v) {
            $this->admin->$k = $v;
        }
        $this->admin->save();

        foreach ($employee as $k => $v) {
            $this->employee->$k = $v;
        }
        $this->employee->save();

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, [
                'where' => $filter,
            ])
            ->assertJsonFragment(['id' => $this->employee->id])
            ->assertJsonFragment(['total' => 1]);
    }

    public static function queryFiltersProvider()
    {
        return [
            'language ability' => [
                ['languageAbility' => LanguageAbility::BILINGUAL->name],
                ['looking_for_bilingual' => false],
                ['looking_for_bilingual' => true],
            ],

            'position duration' => [
                ['positionDuration' => [PositionDuration::PERMANENT->name]],
                ['position_duration' => [PositionDuration::TEMPORARY->name]],
                ['position_duration' => [PositionDuration::PERMANENT->name]],
            ],

            'location preferences' => [
                ['locationPreferences' => [WorkRegion::ATLANTIC->name]],
                ['location_preferences' => [WorkRegion::BRITISH_COLUMBIA->name]],
                ['location_preferences' => [WorkRegion::ATLANTIC->name]],
            ],

            'operational requirements' => [
                ['operationalRequirements' => [OperationalRequirement::DRIVERS_LICENSE->name]],
                ['accepted_operational_requirements' => [OperationalRequirement::ON_CALL->name]],
                ['accepted_operational_requirements' => [OperationalRequirement::DRIVERS_LICENSE->name]],
            ],

            'priority entitlement' => [
                ['hasPriorityEntitlement' => true],
                ['has_priority_entitlement' => false],
                ['has_priority_entitlement' => true],
            ],

            'general search' => [
                // Use a UUID to ensure we are specific about what we are searching for
                ['generalSearch' => 'f945ed74-9d28-4232-bc2b-808b9554a40f'],
                ['first_name' => 'Admin'],
                ['first_name' => 'f945ed74-9d28-4232-bc2b-808b9554a40f'],
            ],
        ];
    }
}
