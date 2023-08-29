<?php

use App\Models\ExperienceSkill;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;

class UserSkillTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    protected $user;

    protected $differentUser;

    protected function setUp(): void
    {
        parent::setUp();
        // Run necessary seeders
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();
        $this->user = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'user@test.com',
                'sub' => 'user@test.com',
            ]);
        $this->differentUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'mischievous@test.com',
                'sub' => 'mischievous@test.com',
            ]);
    }

    protected $createUserSkill =
    /** @lang GraphQL */
    '
        mutation createUserSkill($userId: ID!, $skillId: ID!, $userSkill: CreateUserSkillInput){
            createUserSkill(userId: $userId, skillId: $skillId, userSkill: $userSkill) {
                id
                user {
                    id
                }
                skill {
                    id
                }
                skillLevel
                whenSkillUsed
            }
        }
    ';

    protected $updateUserSkill =
    /** @lang GraphQL */
    '
        mutation updateUserSkill($id: ID!, $userSkill: UpdateUserSkillInput){
            updateUserSkill(id :$id, userSkill: $userSkill) {
                id
                skillLevel
                whenSkillUsed
            }
        }
    ';

    protected $deleteUserSkill =
    /** @lang GraphQL */
    '
        mutation deleteUserSkill($id: ID!){
            deleteUserSkill(id :$id) {
                id
            }
        }
    ';

    protected $updateUserSkillRankings =
    /** @lang GraphQL */
    '
        mutation updateUserSkillRankings($userId: UUID!, $userSkillRanking: UpdateUserSkillRankingsInput!){
            updateUserSkillRankings(userId :$userId, userSkillRanking:$userSkillRanking) {
                id
                topTechnicalSkillsRanking {
                    id
                    topSkillsRank
                }
                topBehaviouralSkillsRanking {
                    id
                    topSkillsRank
                }
                improveTechnicalSkillsRanking {
                    id
                    improveSkillsRank
                }
                improveBehaviouralSkillsRanking {
                    id
                    improveSkillsRank
                }
            }
        }
    ';

    public function testExperienceRelationshipSkipsSoftDeletedPivots(): void
    {
        Skill::factory()->count(3)->create();
        $experience = WorkExperience::factory()->withSkills(1)->create();
        $userSkill = $experience->userSkills->first();
        // sanity check
        $this->assertCount(1, $userSkill->fresh()->workExperiences);
        // soft-delete one ExperienceSkill
        $pivot = ExperienceSkill::first();
        $pivot->deleted_at = Carbon::now();
        $pivot->save();
        // assert that the soft-deleted relationship is ignored
        $this->assertCount(0, $userSkill->fresh()->workExperiences);
    }

    public function testUserSkillPolicy(): void
    {
        $skill = Skill::factory()->create();
        $userSkillModel = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'skill_id' => $skill->id,
        ]);

        // assert policy blocks differentUser from doing anything to user
        $this->actingAs($this->differentUser, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                    'userSkill' => null,
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->differentUser, 'api')
            ->graphQL(
                $this->updateUserSkill,
                [
                    'id' => $userSkillModel->id,
                    'userSkill' => [
                        'skillLevel' => ApiEnums::SKILL_LEVEL_BEGINNER,
                        'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_PAST,
                    ],
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->differentUser, 'api')
            ->graphQL(
                $this->deleteUserSkill,
                [
                    'id' => $userSkillModel->id,
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->differentUser, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'topTechnicalSkillsRanked' => [],
                        'topBehaviouralSkillsRanked' => [],
                        'improveTechnicalSkillsRanked' => [],
                        'improveBehaviouralSkillsRanked' => [],
                    ],
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testUserSkillCreationNoOptional(): void
    {
        $skill = Skill::factory()->create();

        // assert user can successfully create with optional fields null
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                    'userSkill' => null,
                ]
            )
            ->assertJsonFragment([
                'user' => [
                    'id' => $this->user->id,
                ],
                'skill' => [
                    'id' => $skill->id,
                ],
                'skillLevel' => null,
                'whenSkillUsed' => null,
            ]);
    }

    public function testUserSkillCreationWithOptional(): void
    {
        $skill = Skill::factory()->create();

        // assert user can successfully create with optional fields set
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                    'userSkill' => [
                        'skillLevel' => ApiEnums::SKILL_LEVEL_BEGINNER,
                        'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_CURRENT,
                    ],
                ]
            )
            ->assertJsonFragment([
                'user' => [
                    'id' => $this->user->id,
                ],
                'skill' => [
                    'id' => $skill->id,
                ],
                'skillLevel' => ApiEnums::SKILL_LEVEL_BEGINNER,
                'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_CURRENT,
            ]);

        // assert duplication validation error for re-submitting the above
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                    'userSkill' => [
                        'skillLevel' => ApiEnums::SKILL_LEVEL_BEGINNER,
                        'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_CURRENT,
                    ],
                ]
            )
            ->assertGraphQLErrorMessage('DuplicateUserSkill');
    }

    public function testUserSkillCreationByRestoring(): void
    {
        $skill = Skill::factory()->create();

        // create a UserSkill with all fields set
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                    'userSkill' => [
                        'skillLevel' => ApiEnums::SKILL_LEVEL_BEGINNER,
                        'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_CURRENT,
                    ],
                ]
            )
            ->assertJsonFragment([
                'user' => [
                    'id' => $this->user->id,
                ],
                'skill' => [
                    'id' => $skill->id,
                ],
                'skillLevel' => ApiEnums::SKILL_LEVEL_BEGINNER,
                'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_CURRENT,
            ]);

        // soft delete the model
        $userSkillModel = UserSkill::where('user_id', $this->user->id)->first();
        $userSkillModel->deleted_at = Carbon::now();
        $userSkillModel->save();

        // attempt to create again with the same user and skill, but no optional fields passed in
        // assert the soft deleted model is returned and its previous optional fields intact
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                ]
            )
            ->assertJsonFragment([
                'user' => [
                    'id' => $this->user->id,
                ],
                'skill' => [
                    'id' => $skill->id,
                ],
                'skillLevel' => ApiEnums::SKILL_LEVEL_BEGINNER,
                'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_CURRENT,
            ]);
    }

    public function testUserSkillUpdating(): void
    {
        $skill = Skill::factory()->create();
        $userSkillModel = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'skill_id' => $skill->id,
        ]);

        // assert user successfully updates their UserSkill
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkill,
                [
                    'id' => $userSkillModel->id,
                    'userSkill' => [
                        'skillLevel' => ApiEnums::SKILL_LEVEL_EXPERT,
                        'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_CURRENT,
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $userSkillModel->id,
                'skillLevel' => ApiEnums::SKILL_LEVEL_EXPERT,
                'whenSkillUsed' => ApiEnums::WHEN_SKILL_USED_CURRENT,
            ]);
    }

    public function testUserSkillDeleting(): void
    {
        $skill = Skill::factory()->create();
        $userSkillModel = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'skill_id' => $skill->id,
        ]);

        // check deleted at is null
        assertNull($userSkillModel->deleted_at);

        // assert user soft deletes the model by checking that deleted at is no longer null
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->deleteUserSkill,
                [
                    'id' => $userSkillModel->id,
                ]
            );
        $userSkillModel->refresh();
        assertNotNull($userSkillModel->deleted_at);
    }

    public function testUserSkillAndExperienceSkillDeleting(): void
    {
        $skill = Skill::factory()->create();
        $userSkillModel = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'skill_id' => $skill->id,
        ]);
        $workExperienceModel = WorkExperience::factory()->create([
            'user_id' => $this->user->id,
        ]);
        DB::table('experience_skill')->insert([
            'experience_id' => $workExperienceModel->id,
            'experience_type' => 'workExperience',
            'user_skill_id' => $userSkillModel->id,
        ]);
        $experienceSkillModel = ExperienceSkill::first();

        // assert user soft deleting the model soft deletes records in two tables by checking deleted at
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->deleteUserSkill,
                [
                    'id' => $userSkillModel->id,
                ]
            );
        $userSkillModel->refresh();
        $experienceSkillModel->refresh();
        assertNotNull($userSkillModel->deleted_at);
        assertNotNull($experienceSkillModel->deleted_at);

        // assert user restores records by checking deleted at
        // only reverse the soft deletion for UserSkill, experience_skill not reversed
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                ]
            );
        $userSkillModel->refresh();
        $experienceSkillModel->refresh();
        assertNull($userSkillModel->deleted_at);
        assertNotNull($experienceSkillModel->deleted_at);
    }

    public function testUserSkillRankingChangesNullEmptyInput(): void
    {
        $userSkillTechnicalTop = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 1,
            // 'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalImprove = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 1,
            // 'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);

        // assert a null input value changes nothing, while an empty array functions like a clear
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'topTechnicalSkillsRanked' => [],
                        'improveTechnicalSkillsRanked' => null,
                    ],
                ]
            )
            ->assertJsonFragment([
                'topTechnicalSkillsRanking' => [],
                'improveTechnicalSkillsRanking' => [
                    [
                        'id' => $userSkillTechnicalImprove->id,
                        'improveSkillsRank' => $userSkillTechnicalImprove->improve_skills_rank,
                    ],
                ],
            ]);
    }

    public function testUserSkillTopTechnicalSkillsRanking(): void
    {
        $userSkillTechnicalTop1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 1,
            // 'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalTop2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 5,
            // 'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalTop3 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 2,
            // 'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalTop4 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 4,
            // 'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);

        // pass in new order of skill 2 then 1 then 4
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'topTechnicalSkillsRanked' => [$userSkillTechnicalTop2->id, $userSkillTechnicalTop1->id, $userSkillTechnicalTop4->id],
                    ],
                ]
            );

        // assert topTechnicalSkillsRanking is an array of three, sorted with skill 2 then 1 then 4, checks numbers too
        $response = $this->actingAs($this->user, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    id
                    topTechnicalSkillsRanking {
                        id
                        topSkillsRank
                    }
                }
            }
            ',
                [
                    'id' => $this->user->id,
                ]
            )->assertJson(
                fn (AssertableJson $json) => $json->has('data.user.topTechnicalSkillsRanking', 3)
                    ->has(
                        'data.user.topTechnicalSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalTop2->id)
                            ->where('topSkillsRank', 1)
                    )
                    ->has(
                        'data.user.topTechnicalSkillsRanking.1',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalTop1->id)
                            ->where('topSkillsRank', 2)
                    )
                    ->has(
                        'data.user.topTechnicalSkillsRanking.2',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalTop4->id)
                            ->where('topSkillsRank', 3)
                    )
            );
    }

    // public function testUserSkillTopBehaviouralSkillsRanking(): void
    // {
    //     //
    // }

    // public function testUserSkillImproveTechnicalSkillsRanking(): void
    // {
    //     //
    // }

    // public function testUserSkillImproveBehaviouralSkillsRanking(): void
    // {
    //     //
    // }

    public function testUserSkillRankingBehaviouralTechnicalHandling(): void
    {
        $userSkillTechnicalTop1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 2,
            'improve_skills_rank' => 2,
            // 'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalTop2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 3,
            'improve_skills_rank' => 3,
            // 'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillBehaviouralTop1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 1,
            'improve_skills_rank' => 1,
            // 'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);
        $userSkillBehaviouralTop2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 3,
            'improve_skills_rank' => 3,
            // 'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);

        // top skills is 2 then 1, while improve skills is 1 then 2
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'topTechnicalSkillsRanked' => [$userSkillTechnicalTop2->id, $userSkillTechnicalTop1->id],
                        'improveTechnicalSkillsRanked' => [$userSkillTechnicalTop1->id, $userSkillTechnicalTop2->id],
                    ],
                ]
            );

        // assert updating technical user skills does not impact behavioural skills (rank values of 1 and 3 with 2 missing)
        $response = $this->actingAs($this->user, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
        query user($id: UUID!) {
            user(id: $id) {
                id
                topTechnicalSkillsRanking {
                    id
                    topSkillsRank
                }
                topBehaviouralSkillsRanking {
                    id
                    topSkillsRank
                }
                improveTechnicalSkillsRanking {
                    id
                    improveSkillsRank
                }
                improveBehaviouralSkillsRanking {
                    id
                    improveSkillsRank
                }
            }
        }
        ',
                [
                    'id' => $this->user->id,
                ]
            )->assertJson(
                fn (AssertableJson $json) => $json->has('data.user.topTechnicalSkillsRanking', 2)
                    ->has(
                        'data.user.topTechnicalSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalTop2->id)
                            ->where('topSkillsRank', 1)
                    )
                    ->has(
                        'data.user.topTechnicalSkillsRanking.1',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalTop1->id)
                            ->where('topSkillsRank', 2)
                    )
                    ->has('data.user.topBehaviouralSkillsRanking', 2)
                    // ->has(
                    //     'data.user.topBehaviouralSkillsRanking.0',
                    //     fn (AssertableJson $json) =>
                    //     $json->where('id', $userSkillBehaviouralTop1->id)
                    //         ->where('topSkillsRank', 1)
                    // )
                    // ->has(
                    //     'data.user.topBehaviouralSkillsRanking.1',
                    //     fn (AssertableJson $json) =>
                    //     $json->where('id', $userSkillBehaviouralTop2->id)
                    //         ->where('topSkillsRank', 3)
                    // )
                    ->has('data.user.improveTechnicalSkillsRanking', 2)
                    ->has(
                        'data.user.improveTechnicalSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalTop1->id)
                            ->where('improveSkillsRank', 1)
                    )
                    ->has(
                        'data.user.improveTechnicalSkillsRanking.1',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalTop2->id)
                            ->where('improveSkillsRank', 2)
                    )
                    ->has('data.user.improveBehaviouralSkillsRanking', 2)
                // ->has(
                //     'data.user.improveTechnicalSkillsRanking.0',
                //     fn (AssertableJson $json) =>
                //     $json->where('id', $userSkillTechnicalTop2->id)
                //         ->where('topSkillsRank', 1)
                // )
                // ->has(
                //     'data.user.improveBehaviouralSkillsRanking.1',
                //     fn (AssertableJson $json) =>
                //     $json->where('id', $userSkillTechnicalTop1)
                //         ->where('topSkillsRank', 2)
                // )
            );
    }
}
