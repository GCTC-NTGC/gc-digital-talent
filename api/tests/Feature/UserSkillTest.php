<?php

namespace Tests\Feature;

use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Models\ExperienceSkill;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;

class UserSkillTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

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
        mutation createUserSkill($userId: UUID!, $skillId: UUID!, $userSkill: CreateUserSkillInput){
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
        mutation updateUserSkill($id: UUID!, $userSkill: UpdateUserSkillInput){
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
        mutation deleteUserSkill($id: UUID!){
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
                        'skillLevel' => SkillLevel::BEGINNER->name,
                        'whenSkillUsed' => WhenSkillUsed::PAST->name,
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
                        'skillLevel' => SkillLevel::BEGINNER->name,
                        'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
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
                'skillLevel' => SkillLevel::BEGINNER->name,
                'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
            ]);

        // assert duplication validation error for re-submitting the above
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                    'userSkill' => [
                        'skillLevel' => SkillLevel::BEGINNER->name,
                        'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
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
                        'skillLevel' => SkillLevel::BEGINNER->name,
                        'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
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
                'skillLevel' => SkillLevel::BEGINNER->name,
                'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
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
                'skillLevel' => SkillLevel::BEGINNER->name,
                'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
            ]);
    }

    public function testUserSkillCreationRestoringPersistsNewValues(): void
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
                        'skillLevel' => SkillLevel::BEGINNER->name,
                        'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
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
                'skillLevel' => SkillLevel::BEGINNER->name,
                'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
            ]);

        // soft delete the model
        $userSkillModel = UserSkill::where('user_id', $this->user->id)->first();
        $userSkillModel->deleted_at = Carbon::now();
        $userSkillModel->save();

        // attempt to create again with the same user and skill, but with one optional field passed in
        // assert the soft deleted model is returned and that it persists the new value for the updated one, and kept the other the same
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill->id,
                    'userSkill' => [
                        'skillLevel' => SkillLevel::LEAD->name,
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
                'skillLevel' => SkillLevel::LEAD->name,
                'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
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
                        'skillLevel' => SkillLevel::ADVANCED->name,
                        'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $userSkillModel->id,
                'skillLevel' => SkillLevel::ADVANCED->name,
                'whenSkillUsed' => WhenSkillUsed::CURRENT->name,
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
            'experience_type' => WorkExperience::class,
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
            'improve_skills_rank' => null,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalImprove = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => null,
            'improve_skills_rank' => 2,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);

        // user has one technical top skill and one technical improve skill
        // clear the top skill with an empty array, pass in null for the improve skill
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
            )->assertSuccessful();

        // assert top skills is now an empty array while improve skill is the same as above with a rank of 2
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
                    improveTechnicalSkillsRanking {
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
                fn (AssertableJson $json) => $json->has('data.user.topTechnicalSkillsRanking', 0)
                    ->has('data.user.improveTechnicalSkillsRanking', 1)
                    ->has(
                        'data.user.improveTechnicalSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalImprove->id)
                            ->where('improveSkillsRank', 2)
                    )
            );
    }

    public function testUserSkillTopTechnicalSkillsRanking(): void
    {
        $userSkillTechnicalTop1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 1,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalTop2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 5,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalTop3 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 2,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalTop4 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 4,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);

        // pass in new order of skill 2 then 1 then 4
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'topTechnicalSkillsRanked' => [$userSkillTechnicalTop2->skill_id, $userSkillTechnicalTop1->skill_id, $userSkillTechnicalTop4->skill_id],
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

    public function testUserSkillTopBehaviouralSkillsRanking(): void
    {
        $userSkillBehaviouralTop1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 1,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);
        $userSkillBehaviouralTop2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 5,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);
        $userSkillBehaviouralTop3 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 2,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);
        $userSkillBehaviouralTop4 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 4,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);

        // pass in new order of skill 2 then 1 then 4
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'topBehaviouralSkillsRanked' => [$userSkillBehaviouralTop2->skill_id, $userSkillBehaviouralTop1->skill_id, $userSkillBehaviouralTop4->skill_id],
                    ],
                ]
            );

        // assert topBehaviouralSkillsRanking is an array of three, sorted with skill 2 then 1 then 4, checks numbers too
        $response = $this->actingAs($this->user, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    id
                    topBehaviouralSkillsRanking {
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
                fn (AssertableJson $json) => $json->has('data.user.topBehaviouralSkillsRanking', 3)
                    ->has(
                        'data.user.topBehaviouralSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralTop2->id)
                            ->where('topSkillsRank', 1)
                    )
                    ->has(
                        'data.user.topBehaviouralSkillsRanking.1',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralTop1->id)
                            ->where('topSkillsRank', 2)
                    )
                    ->has(
                        'data.user.topBehaviouralSkillsRanking.2',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralTop4->id)
                            ->where('topSkillsRank', 3)
                    )
            );
    }

    public function testUserSkillImproveTechnicalSkillsRanking(): void
    {
        $userSkillTechnicalImprove1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 1,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalImprove2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 5,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalImprove3 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 2,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalImprove4 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 4,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);

        // pass in new order of skill 2 then 1 then 4
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'improveTechnicalSkillsRanked' => [$userSkillTechnicalImprove2->skill_id, $userSkillTechnicalImprove1->skill_id, $userSkillTechnicalImprove4->skill_id],
                    ],
                ]
            );

        // assert improveTechnicalSkillsRanking is an array of three, sorted with skill 2 then 1 then 4, checks numbers too
        $response = $this->actingAs($this->user, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    id
                    improveTechnicalSkillsRanking {
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
                fn (AssertableJson $json) => $json->has('data.user.improveTechnicalSkillsRanking', 3)
                    ->has(
                        'data.user.improveTechnicalSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalImprove2->id)
                            ->where('improveSkillsRank', 1)
                    )
                    ->has(
                        'data.user.improveTechnicalSkillsRanking.1',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalImprove1->id)
                            ->where('improveSkillsRank', 2)
                    )
                    ->has(
                        'data.user.improveTechnicalSkillsRanking.2',
                        fn (AssertableJson $json) => $json->where('id', $userSkillTechnicalImprove4->id)
                            ->where('improveSkillsRank', 3)
                    )
            );
    }

    public function testUserSkillImproveBehaviouralSkillsRanking(): void
    {
        $userSkillBehaviouralImprove1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 1,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);
        $userSkillBehaviouralImprove2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 5,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);
        $userSkillBehaviouralImprove3 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 2,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);
        $userSkillBehaviouralImprove4 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'improve_skills_rank' => 4,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);

        // pass in new order of skill 2 then 1 then 4
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'improveBehaviouralSkillsRanked' => [$userSkillBehaviouralImprove2->skill_id, $userSkillBehaviouralImprove1->skill_id, $userSkillBehaviouralImprove4->skill_id],
                    ],
                ]
            );

        // assert topBehaviouralSkillsRanking is an array of three, sorted with skill 2 then 1 then 4, checks numbers too
        $response = $this->actingAs($this->user, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    id
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
                fn (AssertableJson $json) => $json->has('data.user.improveBehaviouralSkillsRanking', 3)
                    ->has(
                        'data.user.improveBehaviouralSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralImprove2->id)
                            ->where('improveSkillsRank', 1)
                    )
                    ->has(
                        'data.user.improveBehaviouralSkillsRanking.1',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralImprove1->id)
                            ->where('improveSkillsRank', 2)
                    )
                    ->has(
                        'data.user.improveBehaviouralSkillsRanking.2',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralImprove4->id)
                            ->where('improveSkillsRank', 3)
                    )
            );
    }

    public function testUserSkillRankingBehaviouralTechnicalHandling(): void
    {
        $userSkillTechnicalTop1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 2,
            'improve_skills_rank' => 2,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnicalTop2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 3,
            'improve_skills_rank' => 3,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillBehaviouralTop1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 1,
            'improve_skills_rank' => 1,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);
        $userSkillBehaviouralTop2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'top_skills_rank' => 3,
            'improve_skills_rank' => 3,
            'skill_id' => Skill::factory(['category' => 'BEHAVIOURAL']),
        ]);

        // top skills is 2 then 1, while improve skills is 1 then 2
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'topTechnicalSkillsRanked' => [$userSkillTechnicalTop2->skill_id, $userSkillTechnicalTop1->skill_id],
                        'improveTechnicalSkillsRanked' => [$userSkillTechnicalTop1->skill_id, $userSkillTechnicalTop2->skill_id],
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
                    ->has(
                        'data.user.topBehaviouralSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralTop1->id)
                            ->where('topSkillsRank', 1)
                    )
                    ->has(
                        'data.user.topBehaviouralSkillsRanking.1',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralTop2->id)
                            ->where('topSkillsRank', 3)
                    )
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
                    ->has(
                        'data.user.improveBehaviouralSkillsRanking.0',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralTop1->id)
                            ->where('improveSkillsRank', 1)
                    )
                    ->has(
                        'data.user.improveBehaviouralSkillsRanking.1',
                        fn (AssertableJson $json) => $json->where('id', $userSkillBehaviouralTop2->id)
                            ->where('improveSkillsRank', 3)
                    )
            );
    }

    public function testUserSkillRankingAutoCreation(): void
    {
        UserSkill::truncate();
        $skill1 = Skill::factory()->create(['category' => 'TECHNICAL']);
        $skill2 = Skill::factory()->create(['category' => 'TECHNICAL']);
        $skill3 = Skill::factory()->create(['category' => 'TECHNICAL']);

        // no UserSkill models present, pass in 3 skills for the mutation, skill 2 then 1 then 3
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'topTechnicalSkillsRanked' => [$skill2->id, $skill1->id, $skill3->id],
                    ],
                ]
            )->assertSuccessful();

        // assert 3 UserSkill models were created, and sorted in the order of 2 then 1 then 3
        $response = $this->actingAs($this->user, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            query user($id: UUID!) {
                user(id: $id) {
                    topTechnicalSkillsRanking {
                        topSkillsRank
                        skill {
                            id
                        }
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
                        fn ($json) => $json->where('topSkillsRank', 1)
                            ->has(
                                'skill',
                                fn ($json) => $json->where('id', $skill2->id)
                            )
                    )
                    ->has(
                        'data.user.topTechnicalSkillsRanking.1',
                        fn ($json) => $json->where('topSkillsRank', 2)
                            ->has(
                                'skill',
                                fn ($json) => $json->where('id', $skill1->id)
                            )
                    )
                    ->has(
                        'data.user.topTechnicalSkillsRanking.2',
                        fn ($json) => $json->where('topSkillsRank', 3)
                            ->has(
                                'skill',
                                fn ($json) => $json->where('id', $skill3->id)
                            )
                    )
            );
    }

    // cannot have duplicates in one showcase section
    // also tests App\\Rules\\ArrayIsUnique
    public function testNoDuplicatesInOneShowcase(): void
    {
        $userSkillTechnical1 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);
        $userSkillTechnical2 = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'skill_id' => Skill::factory(['category' => 'TECHNICAL']),
        ]);

        // pass duplicates within one array, it fails
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'improveTechnicalSkillsRanked' => [
                            $userSkillTechnical1->skill_id,
                            $userSkillTechnical1->skill_id,
                        ],
                    ],
                ]
            )->assertGraphQLValidationError('userSkillRanking.improveTechnicalSkillsRanked', 'ArrayContainsDuplicates');

        // passes even if the same skill appears multiple times, so long as it is in separate arrays
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->updateUserSkillRankings,
                [
                    'userId' => $this->user->id,
                    'userSkillRanking' => [
                        'improveTechnicalSkillsRanked' => [
                            $userSkillTechnical1->skill_id,
                            $userSkillTechnical2->skill_id,
                        ],
                        'topTechnicalSkillsRanked' => [
                            $userSkillTechnical1->skill_id,
                        ],
                    ],
                ]
            )->assertJsonFragment(['id' => $this->user->id]);
    }
}
