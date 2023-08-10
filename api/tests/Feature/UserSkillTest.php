<?php

use App\Models\ExperienceSkill;
use App\Models\Skill;
use App\Models\WorkExperience;
use App\Models\User;
use App\Models\UserSkill;
use Carbon\Carbon;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

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

    public function testUserSkillCreation(): void
    {
        $skill = Skill::factory()->create();
        $skill2 = Skill::factory()->create();

        // assert policy blocks differentUser from acting on user
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

        // assert user can successfully create with optional fields set
        $this->actingAs($this->user, 'api')
            ->graphQL(
                $this->createUserSkill,
                [
                    'userId' => $this->user->id,
                    'skillId' => $skill2->id,
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
                    'id' => $skill2->id,
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
                    'skillId' => $skill2->id,
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
}
