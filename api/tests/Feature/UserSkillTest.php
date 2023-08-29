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
}
