<?php

namespace Tests\Feature;

use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class KeywordSearchTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $platformAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();

        $this->seed(RolePermissionSeeder::class);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
                'looking_for_english' => null,
                'looking_for_french' => null,
                'looking_for_bilingual' => null,
                'accepted_operational_requirements' => null,
                'location_preferences' => [],
                'has_diploma' => false,
                'position_duration' => [],
                'computed_is_gov_employee' => false,
                'telephone' => null,
                'first_name' => null,
                'last_name' => null,
            ]);
    }

    // Test newly added user can be searched by current_city, the column that is NOT returned by the search query response but available in the user table
    public function test_user_search_by_current_city()
    {
        $user1 = User::factory()->create([
            'current_city' => 'Ottawa',
        ]);
        $user2 = User::factory()->create([
            'current_city' => 'Toronto',
        ]);
        $user3 = User::factory()->create([
            'current_city' => 'Montreal',
        ]);

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
        ', [
                'where' => [
                    'generalSearch' => 'Toronto',
                ],
            ])->assertJson([
                'data' => [
                    'usersPaginated' => [
                        'data' => [
                            [
                                'id' => $user2->id,
                            ],
                        ],
                    ],
                ],
            ]);
    }

    // Test user can not be searched once soft deleted
    public function test_user_search_by_soft_deleted()
    {
        $user1 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'test',
        ]);
        $user2 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'deleted',
            'deleted_at' => '2021-01-01 00:00:00',
        ]);
        $user3 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'philip',
        ]);

        // verify when search by the user full name , the deleted user's id has not been returned
        $this->assertEmpty(User::search('user' & 'deleted')->get()->pluck('id'));

        // verify when search by user first name, the result count is omitting the soft deleted user
        $this->assertEquals(
            2,
            User::search('user')->get()->count()
        );

        // verify when search by user first name, it doesn't return the soft deleted user
        $this->assertNotEquals(
            [$user2->id],
            User::search('user')->get()->pluck('id')->toArray()
        );
    }

    // Test user can be edited and searched by the changed value
    public function test_user_search_by_edited_value()
    {
        $user = User::factory()->asApplicant()->create([
            'first_name' => 'user',
            'last_name' => 'test',
            'telephone' => '1234567890',
            'current_city' => 'Ottawa',
        ]);

        $this->actingAs($user, 'api')->graphQL(

            $updateUserAsUser =
            /** @lang GraphQL */
            '
            mutation updateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!){
                updateUserAsUser(id: $id, user: $user) {
                    telephone
                }
            }
        '
        );

        $this->actingAs($user, 'api')
            ->graphQL(
                $updateUserAsUser,
                [
                    'id' => $user->id,
                    'user' => [
                        'telephone' => '0987654321',
                    ],
                ]
            )
            ->assertJsonFragment(['telephone' => '0987654321']);

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
        ', [
                'where' => [
                    'generalSearch' => '0987654321',
                ],
            ])->assertJson([
                'data' => [
                    'usersPaginated' => [
                        'data' => [
                            [
                                'id' => $user->id,
                            ],
                        ],
                    ],
                ],
            ]);

    }

    // Test user can be searched by their work experience details
    public function test_user_search_by_work_experience()
    {
        $user1 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'test',
        ]);

        $skill = Skill::factory()->create();

        $workExperience1 = WorkExperience::factory()->create([
            'user_id' => $user1->id,
            'role' => 'Software Developer',
            'organization' => 'CDS',
            'start_date' => '2020-01-01',
            'end_date' => '2021-01-01',
        ]);

        $details = 'These are the details of my experience.';
        $workExperience1->syncSkills([
            ['id' => $skill->id,
                'details' => $details],
        ]);

        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                    data {
                        id
                    }
                }
            }
        ', [
                'where' => [
                    'generalSearch' => 'software developer', // verify it is case insensitive
                ],
            ])->assertJson([
                'data' => [
                    'usersPaginated' => [
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                        'data' => [
                            [
                                'id' => $user1->id,
                            ],
                        ],
                    ],
                ]]);
    }

    // Test user can be searched by their education details, partial search and case insensitive
    public function test_user_search_by_education()
    {
        $user1 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'test',
        ]);

        $skill = Skill::factory()->create();

        $education1 = EducationExperience::factory()->create([
            'user_id' => $user1->id,
            'institution' => 'University of Ottawa',
            'thesis_title' => 'Bachelor of Science',
            'area_of_study' => 'Computer Science',
            'start_date' => '2016-01-01',
            'end_date' => '2020-01-01',
        ]);

        $education1->syncSkills([
            ['id' => $skill->id],
        ]);

        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                    data {
                        id
                    }
                }
            }
        ', [
                'where' => [
                    'generalSearch' => 'computer',
                ],
            ])->assertJson([
                'data' => [
                    'usersPaginated' => [
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                        'data' => [
                            [
                                'id' => $user1->id,
                            ],
                        ],
                    ],
                ]]);
    }

    // Test user can be searched by their award details and community experience details
    public function test_user_search_by_award_and_community_experience()
    {
        $user1 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'test',
        ]);

        $skill = Skill::factory()->create();

        $awardExperience1 = AwardExperience::factory()->create([
            'user_id' => $user1->id,
            'title' => 'Award Title',
            'issued_by' => 'CDS',
        ]);

        $awardExperience1->syncSkills([
            ['id' => $skill->id],
        ]);

        $communityExperience1 = CommunityExperience::factory()->create([
            'user_id' => $user1->id,
            'title' => 'Community Title',
            'organization' => 'CDS',
            'start_date' => '2020-01-01',
            'end_date' => '2021-01-01',
        ]);

        $communityExperience1->syncSkills([
            ['id' => $skill->id],
        ]);

        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                    data {
                        id
                    }
                }
            }
        ', [
                'where' => [
                    'generalSearch' => 'award title',
                ],
            ])->assertJson([
                'data' => [
                    'usersPaginated' => [
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                        'data' => [
                            [
                                'id' => $user1->id,
                            ],
                        ],
                    ],
                ]]);

        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                    data {
                        id
                    }
                }
            }
        ', [
                'where' => [
                    'generalSearch' => 'community title',
                ],
            ])->assertJson([
                'data' => [
                    'usersPaginated' => [
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                        'data' => [
                            [
                                'id' => $user1->id,
                            ],
                        ],
                    ],
                ]]);
    }

    // Test user can be searched by their name and work experience organization
    public function test_user_search_by_name_and_work_experience_title()
    {
        // create 3 users with same name
        $user1 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'test',
        ]);

        $user2 = User::factory()->create([
            'first_name' => 'user',
            'last_name' => 'test',
        ]);

        $skill = Skill::factory()->create();

        // set up 2 users with same full name and different work experience organization
        $workExperience1 = WorkExperience::factory()->create([
            'user_id' => $user1->id,
            'role' => 'Software Developer',
            'organization' => 'CDS',
            'start_date' => '2020-01-01',
            'end_date' => '2021-01-01',
        ]);

        $workExperience2 = WorkExperience::factory()->create([
            'user_id' => $user2->id,
            'role' => 'Architect',
            'organization' => 'TVS',
            'start_date' => '2020-01-01',
            'end_date' => '2021-01-01',
        ]);

        // set up third user with different name but works in the same organization as the first user

        $user3 = User::factory()->create([
            'first_name' => 'David',
            'last_name' => 'test',
        ]);

        $workExperience3 = WorkExperience::factory()->create([
            'user_id' => $user3->id,
            'role' => 'some other role',
            'organization' => 'CDS',
            'start_date' => '2020-01-01',
            'end_date' => '2021-01-01',
            'division' => 'division',
            'details' => 'details',
        ]);

        // sync the same skill to all 3 work experiences
        $workExperience1->syncSkills([
            ['id' => $skill->id],
        ]);

        $workExperience2->syncSkills([
            ['id' => $skill->id],
        ]);

        $workExperience3->syncSkills([
            ['id' => $skill->id],
        ]);

        // search by the name and the overlapped company and verify it returns only the user with the matching name and company
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                    data {
                        id
                    }
                }
            }
        ', [
                'where' => [
                    'generalSearch' => '"user" "CDS"',
                ],
            ])->assertJson([
                'data' => [
                    'usersPaginated' => [
                        'paginatorInfo' => [
                            'total' => 1,
                        ],
                        'data' => [
                            [
                                'id' => $user1->id,
                            ],
                        ],
                    ],
                ]]);
    }

    // Test user can be partial matched by name or email by scopes added into generalSearch function
    public function test_user_search_partial_matching_name_email()
    {
        $user1 = User::factory()->create([
            'first_name' => 'john',
            'last_name' => 'smith',
            'email' => 'john@test.com',
            'current_city' => 'abc',
        ]);
        $user2 = User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'johnson',
            'email' => 'bob@test.com',
            'current_city' => 'efg',
        ]);
        $user3 = User::factory()->create([
            'first_name' => 'jones',
            'last_name' => 'hall',
            'email' => 'johnson@test.com',
            'current_city' => 'hij',
        ]);

        // "john" matches three users due to names and emails
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
             ', [
                'where' => [
                    'generalSearch' => 'john',
                ],
            ])->assertJsonCount(
                3, 'data.usersPaginated.data'
            )->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ]);

        // partial name search is case insensitive
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
             ', [
                'where' => [
                    'generalSearch' => 'JOHN',
                ],
            ])->assertJsonCount(
                3, 'data.usersPaginated.data'
            )->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ]);
    }

    public function test_user_search_partial_names_emails_with_or_logic()
    {
        $user1 = User::factory()->create([
            'first_name' => 'john',
            'last_name' => 'smith',
            'email' => 'john@test.com',
            'current_city' => 'abc',
        ]);
        $user2 = User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'johnson',
            'email' => 'bob@test.com',
            'current_city' => 'efg',
        ]);
        $user3 = User::factory()->create([
            'first_name' => 'jones',
            'last_name' => 'hall',
            'email' => 'johnson@test.com',
            'current_city' => 'hij',
        ]);

        // city "abc" OR partial name "hal" matches two users
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
             ', [
                'where' => [
                    'generalSearch' => 'abc OR hal',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');

        // city "abc" OR partial email "johnson@" matches two users
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
             ', [
                'where' => [
                    'generalSearch' => 'abc OR johnson@test',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');

        // OR operator works for partial names
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
             ', [
                'where' => [
                    'generalSearch' => 'johnso or hal',
                ],
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');

        // OR operator works for partial emails
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
             ', [
                'where' => [
                    'generalSearch' => 'BOB@ OR johnson@',
                ],
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');
    }

    public function test_user_search_partial_names_emails_with_quotes()
    {
        $user1 = User::factory()->create([
            'first_name' => 'john',
            'last_name' => 'smith',
            'email' => 'john@test.com',
            'current_city' => 'abc',
        ]);
        $user2 = User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'johnson',
            'email' => 'bob@test.com',
            'current_city' => 'efg',
        ]);
        $user3 = User::factory()->create([
            'first_name' => 'jones',
            'last_name' => 'hall',
            'email' => 'johnson@test.com',
            'current_city' => 'hij',
        ]);

        // A full name surrounded by quotes should only match one person
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
             ', [
                'where' => [
                    'generalSearch' => '"john smith"',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonCount(1, 'data.usersPaginated.data');

        // partial match terms outside quotes - so exact match "johnson" OR partial match "john@"
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
             ', [
                'where' => [
                    'generalSearch' => '"johnson" OR john@',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');
    }

    public function test_user_search_names_emails_with_negative_search()
    {
        $user1 = User::factory()->create([
            'first_name' => 'john',
            'last_name' => 'smith',
            'email' => 'john@test.com',
            'current_city' => 'abc',
        ]);
        $user2 = User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'johnson',
            'email' => 'bob@test.com',
            'current_city' => 'efg',
        ]);
        $user3 = User::factory()->create([
            'first_name' => 'jones',
            'last_name' => 'hall',
            'email' => 'johnson@test.com',
            'current_city' => 'hij',
        ]);

        // negative search term works for names
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
             ', [
                'where' => [
                    'generalSearch' => 'john -smith',
                ],
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');

        // negative search term works for full email
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
             ', [
                'where' => [
                    'generalSearch' => 'john -bob@test.com',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');

        // negative search should NOT work for partial names or emails, as that may lead to unexpected negatives matches
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
                ', [
                'where' => [
                    'generalSearch' => 'john -smit -bob@t',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonFragment([
                'id' => $user3->id,
            ])->assertJsonCount(3, 'data.usersPaginated.data');
    }

    public function test_user_search_partial_names_emails_with_punctuation()
    {
        $user1 = User::factory()->create([
            'first_name' => 'bob-jones',
            'last_name' => 'o\'brian',
            'email' => 'o_brian@test.com',
            'current_city' => 'abc',
        ]);
        $user2 = User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'jones',
            'email' => 'bob.jones@test.com',
            'current_city' => 'def',
        ]);

        // assert dash in name doesn't negative search
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
            ', [
                'where' => [
                    'generalSearch' => 'bob-jon',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonCount(1, 'data.usersPaginated.data');

        // punctuation preserved
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
            ', [
                'where' => [
                    'generalSearch' => 'o_bria',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonCount(1, 'data.usersPaginated.data');
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
            ', [
                'where' => [
                    'generalSearch' => 'bob.jone',
                ],
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonCount(1, 'data.usersPaginated.data');

        // partial match without including punctuation
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
            ', [
                'where' => [
                    'generalSearch' => 'bob jone',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');
    }

    public function test_user_search_multi_spacing()
    {
        $user1 = User::factory()->create([
            'first_name' => 'john',
            'last_name' => 'smith',
            'email' => 'john@test.com',
            'current_city' => 'abc',
        ]);
        $user2 = User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'johnson',
            'email' => 'bob@test.com',
            'current_city' => 'efg',
        ]);
        $user3 = User::factory()->create([
            'first_name' => 'jones',
            'last_name' => 'hall',
            'email' => 'johnson@test.com',
            'current_city' => 'hij',
        ]);

        // search operators unaffected by multiple spaces being present, two users returned regardless of spacing
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
             ', [
                'where' => [
                    'generalSearch' => '"johnson" OR john@',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');
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
             ', [
                'where' => [
                    'generalSearch' => '  "johnson"    OR     john@     ',
                ],
            ])->assertJsonFragment([
                'id' => $user1->id,
            ])->assertJsonFragment([
                'id' => $user2->id,
            ])->assertJsonCount(2, 'data.usersPaginated.data');
    }
}
