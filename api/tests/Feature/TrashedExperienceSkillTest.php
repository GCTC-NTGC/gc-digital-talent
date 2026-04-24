<?php

namespace Tests\Feature;

use App\Models\ExperienceSkill;
use App\Models\PersonalExperience;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

class TrashedExperienceSkillTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesUnprotectedGraphqlEndpoint;

    protected User $user;

    protected Skill $skill;

    protected PersonalExperience $experience;

    protected UserSkill $userSkill;

    protected string $query = <<<'GRAPHQL'
        query TrashedExperienceSkill($where: TrashedExperienceSkillInput!) {
            trashedExperienceSkill(where: $where) {
                details
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()
            ->asApplicant()
            ->create();

        $this->skill = Skill::factory()->create();

        $this->experience = PersonalExperience::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $this->userSkill = UserSkill::factory()->create([
            'user_id' => $this->user->id,
            'skill_id' => $this->skill->id,
        ]);
    }

    #[DataProvider('trashedExperienceSkillProvider')]
    public function testTrashedExperienceSkill($expected, $pivotData, $restore, $isOwner, $shouldError = false): void
    {
        $skillId = $this->skill->id;
        $targetUserSkill = $this->userSkill;

        if (! $isOwner) {
            $otherUser = User::factory()->asApplicant()->create();
            $targetUserSkill = UserSkill::factory()->create([
                'user_id' => $otherUser->id,
                'skill_id' => $this->skill->id,
            ]);
        }

        if ($pivotData !== null) {
            $this->experience->userSkills()->attach($targetUserSkill->id, [
                'details' => $pivotData['details'],
            ]);

            if ($pivotData['trashed']) {
                ExperienceSkill::where([
                    'experience_id' => $this->experience->id,
                    'user_skill_id' => $targetUserSkill->id,
                ])->delete();
            }
        }

        $response = $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'where' => [
                    'experienceId' => $this->experience->id,
                    'skillId' => $skillId,
                    'restore' => $restore,
                ],
            ]);

        if ($shouldError) {
            $response->assertGraphQLErrorMessage('This action is unauthorized.');

            return;
        }

        $response->assertJson([
            'data' => [
                'trashedExperienceSkill' => $expected === null ? null : ['details' => $expected],
            ],
        ]);

        if ($restore && ($pivotData['trashed'] ?? false) && $isOwner) {
            $this->assertDatabaseHas('experience_skill', [
                'experience_id' => $this->experience->id,
                'user_skill_id' => $targetUserSkill->id,
                'deleted_at' => null,
            ]);
        }
    }

    public static function trashedExperienceSkillProvider(): array
    {
        return [
            'successfully restore soft deleted record' => [
                'expected' => 'Found you!',
                'pivotData' => ['details' => 'Found you!', 'trashed' => true],
                'restore' => true,
                'isOwner' => true,
            ],
            'view soft deleted record without restoring' => [
                'expected' => 'Stay trashed',
                'pivotData' => ['details' => 'Stay trashed', 'trashed' => true],
                'restore' => false,
                'isOwner' => true,
            ],
            'return already active record' => [
                'expected' => 'Active record',
                'pivotData' => ['details' => 'Active record', 'trashed' => false],
                'restore' => false,
                'isOwner' => true,
            ],
            'return null if no pivot exists for this experience' => [
                'expected' => null,
                'pivotData' => null,
                'restore' => false,
                'isOwner' => true,
            ],
            'unauthorized if pivot belongs to another user' => [
                'expected' => null,
                'pivotData' => ['details' => 'Someone elses', 'trashed' => true],
                'restore' => false,
                'isOwner' => false,
                'shouldError' => true,
            ],
            'unauthorized if attempting to restore someone elses record' => [
                'expected' => null,
                'pivotData' => ['details' => 'Forbidden Restore', 'trashed' => true],
                'restore' => true,
                'isOwner' => false,
                'shouldError' => true,
            ],
        ];
    }
}
