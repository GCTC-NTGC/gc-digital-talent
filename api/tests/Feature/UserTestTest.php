<?php

namespace Tests\Feature;

use App\Enums\IndigenousCommunity;
use App\Enums\LanguageAbility;
use App\Enums\PoolCandidateStatus;
use App\Facades\Notify;
use App\Models\AwardExperience;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Role;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertSame;

class UserTestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $platformAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->bootRefreshesSchemaCache();
        // Run necessary seeders
        $this->seed(ClassificationSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin@test.com',
                'sub' => 'platform-admin@test.com',

                // The following properties make sure this user doesn't match certain test queries, skewing results.
                'looking_for_english' => null,
                'looking_for_french' => null,
                'looking_for_bilingual' => null,
                'accepted_operational_requirements' => null,
                'location_preferences' => [],
                'has_diploma' => false,
                'position_duration' => [],
                'is_gov_employee' => false,
                'telephone' => null,
                'first_name' => null,
                'last_name' => null,
            ]);
    }

    public function testFilterBySkillsIntersectional(): void
    {
        // Create initial data set
        Skill::factory()->count(20)->create();
        User::factory()->count(5)->create()->each(function ($user) {
            AwardExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            CommunityExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            EducationExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            PersonalExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            WorkExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
        });

        // Create a skill to test for
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $skill3 = Skill::factory()->create();
        User::factory()->afterCreating(function ($user) use ($skill1) {
            AwardExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
            WorkExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
        })->create();
        User::factory()->afterCreating(function ($user) use ($skill1, $skill2) {
            CommunityExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
            PersonalExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill2) {
                    $model->syncSkills([$skill2]);
                })->create();
        })->create();

        // Assert query no skills filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);

        // Assert query empty skills filter array will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'skills' => [],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);

        // Assert query with one skills filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'skillsIntersectional' => [
                            ['id' => $skill1['id']],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2,
                    ],
                ],
            ],
        ]);

        // Assert query with two skills will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'skillsIntersectional' => [
                            ['id' => $skill1['id']],
                            ['id' => $skill2['id']],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);

        // Assert query with unused skill will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'skillsIntersectional' => [
                            ['id' => $skill3['id']],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0,
                    ],
                ],
            ],
        ]);
    }

    public function testFilterByGovEmployee(): void
    {
        // Create initial set of 5 users not with gov.
        User::factory()->count(5)->create([
            'is_gov_employee' => false,
        ]);

        // Create two new users with the government.
        User::factory()->count(2)->create([
            'is_gov_employee' => true,
        ]);

        // Assert query no isGovEmployee filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);

        // Assert query with isGovEmployee filter set to true will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'isGovEmployee' => true,
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2,
                    ],
                ],
            ],
        ]);

        // Assert query with isGovEmployee filter set to false will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'isGovEmployee' => false,
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);
    }

    public function testOrdering(): void
    {
        // Create users for testing
        User::factory()->count(8)->create();
        $usersByName = User::select('id')->orderBy('first_name')->get()->toArray();
        $usersByCreated = User::select('id')->orderByDesc('created_at')->get()->toArray();

        // Assert query no orderBy given defaults to created_at desc
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    data {
                        id
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => $usersByCreated,
                ],
            ],
        ]);

        // Assert query orders by given attribute
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($orderBy: [OrderByClause!]) {
                usersPaginated(orderBy: $orderBy) {
                    data {
                        id
                    }
                }
            }
        ',
            [
                'orderBy' => [
                    [
                        'column' => 'first_name',
                        'order' => 'ASC',
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => $usersByName,
                ],
            ],
        ]);
    }

    public function testCountApplicantsQuery(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();

        // Create new pools and attach to new pool candidates.
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);
        $pool2 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(8)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);
        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => false,
                'looking_for_french' => true,
                'looking_for_bilingual' => false,
            ]),
        ]);
        // Should appear in searches, but in pool 2.
        PoolCandidate::factory()->create([
            'pool_id' => $pool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);
        // Expired in pool - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => '2000-01-01',
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);
        // Already placed - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_TERM->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);
        // User status inactive - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);

        // Query specifying just a pool will return all non-expired, available-status candidates whose Users are looking for or open to opportunities.
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                ],
            ]
        );
        $response->assertJson([
            'data' => [
                'countApplicants' => 14, // including base admin user
            ],
        ]);

        // Assert query with another filter will return proper count
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'languageAbility' => LanguageAbility::ENGLISH->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 9, //including base admin user
            ],
        ]);
    }

    public function testAdminTableFilter(): void
    {
        // Create 5 users
        User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'rob',
            'email' => 'bob@user.com',
            'telephone' => '12345',
        ]);
        User::factory()->create([
            'first_name' => 'sam',
            'last_name' => 'ram',
            'email' => 'sam@user.com',
            'telephone' => '67890',
        ]);
        User::factory()->create([
            'first_name' => 'dan',
            'last_name' => 'man',
            'email' => 'dan@user.com',
            'telephone' => '99999',
        ]);
        User::factory()->create([
            'first_name' => 'sir',
            'last_name' => 'whir',
            'email' => 'sir@user.com',
            'telephone' => '22222',
        ]);
        User::factory()->create([
            'first_name' => 'zak',
            'last_name' => 'pak',
            'email' => 'zak@admin.com',
            'telephone' => '333333',
        ]);

        // Remember the admin user exists:
        // 'email' => 'admin@test.com',
        // 'sub' => 'admin@test.com',

        // Assert no filters returns all five users plus admin@test.com
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 6,
                    ],
                ],
            ],
        ]);

        // Name filtering  //
        // casing should not matter
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'sAm',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);
        // ensure single letter returns all relevant results
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'r',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3,
                    ],
                ],
            ],
        ]);
        // test a full name
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'BoB rOb',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);
        // test name segments
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'bo ro',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);
        // test name segments but in reverse
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'ro bo',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);

        // ensure queries with multiple filter variables apply separately as AND operations (builds off assertion above)
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'r',
                    'telephone' => '12345',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);

        // Assert email filter with partial email returns correct count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'email' => 'user.com',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4,
                    ],
                ],
            ],
        ]);

        // Assert more than one search term results in AND filtering
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'generalSearch' => 'sam 67890',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);

        // Assert filtering for last name in general search returns correct count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'generalSearch' => 'man',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);

        // Assert filtering general search and name search (both subqueries) filter as AND
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'generalSearch' => '@user.com',
                    'name' => 'zak',
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0,
                    ],
                ],
            ],
        ]);
    }

    public function testNullFiltersEqualToUndefined(): void
    {
        // Create users to test filters on
        User::factory(60)->create();

        // Assert that using an empty (ie undefined) filter returns all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 61,
                    ],
                ],
            ],
        ]);

        // Assert that setting every value to null also returns all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'hasDiploma' => null,
                        'equity' => null,
                        'languageAbility' => null,
                        'operationalRequirements' => null,
                        'locationPreferences' => null,
                        'positionDuration' => null,
                        'skills' => null,
                        'pools' => null,
                    ],
                    'poolFilters' => null,
                    'isProfileComplete' => null,
                    'isGovEmployee' => null,
                    'telephone' => null,
                    'email' => null,
                    'name' => null,
                    'generalSearch' => null,
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 61,
                    ],
                ],
            ],
        ]);
    }

    /** After running addSkills, the user should have a UserSkill for each added skill. */
    public function testAddSkillsAddsUserSkills(): void
    {
        $skills = Skill::factory(3)->create();
        $this->platformAdmin->addSkills($skills->pluck('id'));
        $userSkillSkillIds = $this->platformAdmin->userSkills->pluck('skill_id');
        $this->assertSameSize($skills, $userSkillSkillIds);
        foreach ($skills as $skill) {
            $this->assertContains($skill->id, $userSkillSkillIds);
        }
    }

    public function testAddSkillsRestoresSoftDeletedUserSkills(): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $this->platformAdmin->userSkills->first()->delete();
        // The user skill should be trashed (soft-deleted) and by default shouldn't appear in results.
        $this->assertSoftDeleted($userSkill);
        $this->assertEmpty($this->platformAdmin->refresh()->userSkills);
        // Adding the same skill should restore the previous userSkill
        $this->platformAdmin->addSkills([$userSkill->skill_id]);
        $this->assertNotSoftDeleted($userSkill);
        $this->assertContains($userSkill->id, $this->platformAdmin->refresh()->userSkills->pluck('id'));
    }

    public function testAddSkillsDoesNotAddDuplicates(): void
    {
        $skills = Skill::factory(3)->create();
        // The user will already have the first skill.
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
            'skill_id' => $skills[0]->id,
        ]);
        $addSkills = [
            $skills[0]->id, // This skill is already present
            $skills[1]->id,
            $skills[1]->id, // We will try to add this skill twice.
            $skills[2]->id,
        ];
        $this->platformAdmin->addSkills($addSkills);
        // After adding, user should still only have 3 userSkills.
        $this->assertCount(3, $this->platformAdmin->userSkills);
    }

    public function testRoleAssignmentScope(): void
    {
        $testTeam = Team::factory()->create();
        $testPool = Pool::factory()->create();
        $testCommunity = Community::factory()->create();

        $adminId = Role::where('name', 'platform_admin')->value('id');
        $responderId = Role::where('name', 'request_responder')->value('id');
        $poolOperatorId = Role::where('name', 'pool_operator')->value('id');
        $processOperatorId = Role::where('name', 'process_operator')->value('id');
        $communityRecruiterId = Role::where('name', 'community_recruiter')->value('id');
        $communityAdminId = Role::where('name', 'community_admin')->value('id');

        // Create users
        User::factory(1)->asAdmin()->create();
        User::factory(3)->asGuest()->create();
        User::factory(5)->asPoolOperator($testTeam->name)->create();
        User::factory(7)->asRequestResponder()->create();
        User::factory(11)->asApplicant()->create();

        User::factory(2)->asProcessOperator($testPool->id)->create();
        User::factory(3)->asCommunityRecruiter($testCommunity->id)->create();
        User::factory(3)->asCommunityAdmin($testCommunity->id)->create();

        $query =
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ';

        $empty = ['where' => []];
        $nullRoles = ['where' => ['roles' => null]];
        $adminRoles = ['where' => ['roles' => [$adminId]]];
        $responderRoles = ['where' => ['roles' => [$responderId]]];
        $poolRoles = ['where' => ['roles' => [$poolOperatorId]]];
        $processRoles = ['where' => ['roles' => [$processOperatorId]]];
        $recruiterRoles = ['where' => ['roles' => [$communityRecruiterId]]];
        $communityAdminRoles = ['where' => ['roles' => [$communityAdminId]]];
        $communityCombinedRoles = ['where' => ['roles' => [$communityAdminId, $communityRecruiterId]]]; // check more than one role at a time

        assertSame(36, count(User::all())); // ensure total user count is expected 36

        // assert each query returns expected count
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $empty)
            ->assertJsonFragment([
                'total' => 36,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $nullRoles)
            ->assertJsonFragment([
                'total' => 36,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $adminRoles)
            ->assertJsonFragment([
                'total' => 2, // includes created and setup admins
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $responderRoles)
            ->assertJsonFragment([
                'total' => 7,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $poolRoles)
            ->assertJsonFragment([
                'total' => 5,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $processRoles)
            ->assertJsonFragment([
                'total' => 2,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $recruiterRoles)
            ->assertJsonFragment([
                'total' => 3,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $communityAdminRoles)
            ->assertJsonFragment([
                'total' => 3,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $communityCombinedRoles)
            ->assertJsonFragment([
                'total' => 6,
            ]);
    }

    public function testUpdateUserIsStatusOrNonStatusRule(): void
    {
        $applicant = User::factory()->asApplicant()->create();

        $updateUserAsUser =
            /** @lang GraphQL */
            '
            mutation updateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!){
                updateUserAsUser(id: $id, user: $user) {
                    indigenousCommunities {
                        value
                    }
                }
            }
        ';

        // assert user can set STATUS or NON_STATUS but not both
        $this->actingAs($applicant, 'api')
            ->graphQL(
                $updateUserAsUser,
                [
                    'id' => $applicant->id,
                    'user' => [
                        'indigenousCommunities' => [IndigenousCommunity::STATUS_FIRST_NATIONS->name],
                    ],
                ]
            )
            ->assertJsonFragment(['indigenousCommunities' => [[
                'value' => IndigenousCommunity::STATUS_FIRST_NATIONS->name,
            ]]]);
        $this->actingAs($applicant, 'api')
            ->graphQL(
                $updateUserAsUser,
                [
                    'id' => $applicant->id,
                    'user' => [
                        'indigenousCommunities' => [IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name],
                    ],
                ]
            )
            ->assertJsonFragment(['indigenousCommunities' => [[
                'value' => IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name,
            ]]]);
        $this->actingAs($applicant, 'api')
            ->graphQL(
                $updateUserAsUser,
                [
                    'id' => $applicant->id,
                    'user' => [
                        'indigenousCommunities' => [IndigenousCommunity::STATUS_FIRST_NATIONS->name, IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name],
                    ],
                ]
            )
            ->assertGraphQLValidationError('user.indigenousCommunities', 'BothStatusNonStatus');
    }

    public function testUserUpdatingSub(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $baseUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'base-user@test.com',
                'sub' => 'base-user@test.com',
            ]);
        $adminUser = User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);

        $this->actingAs($baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                    updateUserSub(updateUserSubInput:$updateUserSubInput) {
                        sub
                    }
                    }
                ',
            [
                'updateUserSubInput' => [
                    'userId' => $baseUser->id,
                    'sub' => 'admin123',
                ],
            ]
        )->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                    updateUserSub(updateUserSubInput:$updateUserSubInput) {
                        sub
                    }
                    }
                ',
            [
                'updateUserSubInput' => [
                    'userId' => $baseUser->id,
                    'sub' => 'admin123',
                ],
            ]
        )->assertJsonFragment([
            'sub' => 'admin123',
        ]);
    }

    public function testUsersNestedPoolCandidates(): void
    {
        // applicant has one submitted and one draft application
        $applicant = User::factory()->asApplicant()->create();
        $draftApplication = PoolCandidate::factory()->create([
            'user_id' => $applicant->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'submitted_at' => null,
        ]);
        $submittedApplication = PoolCandidate::factory()->create([
            'user_id' => $applicant->id,
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'submitted_at' => config('constants.past_date'),
        ]);

        $candidateCount = count(PoolCandidate::all());
        assertSame(2, $candidateCount);

        $query =
            /** @lang GraphQL */
            '
            query user($id: UUID!) {
                user(id: $id) {
                    poolCandidates {
                        id
                    }
                }
            }
        ';

        // assert admin can fetch applicant user and their applications without error
        // assert the JSON superset only contains one application
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query,
                [
                    'id' => $applicant->id,
                ]
            )->assertJson([
                'data' => [
                    'user' => [
                        'poolCandidates' => [
                            ['id' => $submittedApplication->id],
                        ],
                    ],
                ],
            ]);
    }
}