<?php

namespace Tests\Feature;

use App\Enums\ApiError;
use App\Models\CommunityExperience;
use App\Models\ExperienceSkill;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class SkillTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;
    use WithFaker;

    protected $baseUser;

    protected $adminUser;

    protected $uuid;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->setUpFaker();
        $this->bootRefreshesSchemaCache();

        $this->baseUser = User::create([
            'email' => 'base-user@test.com',
            'sub' => 'base-user@test.com',
        ]);
        $this->baseUser->syncRoles([
            'guest',
            'base_user',
            'pool_operator',
            'request_responder',
        ]);

        $this->adminUser = User::create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
        ]);
        $this->adminUser->addRole('platform_admin');

        $this->uuid = $this->faker->UUID();

        Skill::factory()->create([
            'id' => $this->uuid,
        ]);
    }

    /**
     * Test guest user can view any
     *
     * @return void
     */
    public function testViewAnySkill()
    {
        $this->graphQL('query { skills { id } }')
            ->assertJsonFragment(['id' => $this->uuid]);
    }

    /**
     * Test guest user can view any
     *
     * @return void
     */
    public function testViewSkill()
    {

        $variables = ['id' => $this->uuid];

        $query =
            /** @lang GraphQL */
            '
            query Get($id: UUID!) {
                skill(id: $id) {
                    id
                }
            }
        ';

        $this->graphQL($query, $variables)
            ->assertJsonFragment($variables);
    }

    /**
     * Test updating a skill
     *
     * @return void
     */
    public function testUpdateSkill()
    {
        $variables = [
            'id' => $this->uuid,
            'skill' => [
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
            ],
        ];

        $mutation =
            /** @lang GraphQL */
            '
            mutation UpdateSkill($id: ID!, $skill: UpdateSkillInput!) {
                updateSkill(id: $id, skill: $skill) {
                    id
                    name {
                        en
                        fr
                    }
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['id' => $this->uuid, 'name' => $variables['skill']['name']]);
    }

    /**
     * Test creation of skill
     *
     * @return void
     */
    public function testCreateSkill()
    {
        $variables = [
            'skill' => [
                'key' => 'key',
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
                'category' => 'TECHNICAL',
            ],
        ];

        $mutation =
            /** @lang GraphQL */
            '
            mutation Create($skill: CreateSkillInput!) {
                createSkill(skill: $skill) {
                    id
                    name {
                        en
                        fr
                    }
                    category { value }
                }
            }
        ';

        $this->actingAs($this->baseUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['name' => $variables['skill']['name']]);
    }

    /**
     * Test that non-unique keys fail
     *
     * @return void
     */
    public function testCreateNonUniqueSkillKey()
    {
        $variables = [
            'skill' => [
                'key' => 'newkey',
                'name' => [
                    'en' => 'Non-unique (EN)',
                    'fr' => 'Non-unique (FR)',
                ],
                'category' => 'TECHNICAL',
            ],
        ];

        $mutation =
            /** @lang GraphQL */
            '
            mutation Create($skill: CreateSkillInput!) {
                createSkill(skill: $skill) {
                    id
                    name {
                        en
                        fr
                    }
                    category { value }
                }
            }
        ';

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['name' => $variables['skill']['name']]);

        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $variables)
            ->assertJsonFragment(['skill.key' => ['SkillKeyStringInUse']])
            ->assertGraphQLErrorMessage('Validation failed for the field [createSkill].');
    }

    public function testExperienceRelationshipsSkipSoftDeletedPivots(): void
    {
        Skill::factory()->count(1)->create();
        $experience = CommunityExperience::factory()->withSkills(1)->create();
        $skill = $experience->skills->first();
        // sanity check
        $this->assertCount(1, $skill->fresh()->userSkills->first()->communityExperiences);
        // soft-delete one ExperienceSkill
        $pivot = ExperienceSkill::first();
        $pivot->deleted_at = Carbon::now();
        $pivot->save();
        // assert that the soft-deleted relationship is ignored
        $this->assertCount(0, $skill->fresh()->userSkills->first()->communityExperiences);
    }

    public function testDeletingUsedPoolSkill(): void
    {
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $pool = Pool::factory()->create([
            'published_at' => config('constants.past_datetime'),
            'closing_date' => config('constants.far_future_datetime'),
        ]);
        $pool->setEssentialPoolSkills([$skill1->id, $skill2->id]);
        $mutation =
            /** @lang GraphQL */
            '
            mutation deleteSkill($id: UUID!) {
                deleteSkill(id: $id) {
                    id
                }
            }
        ';

        // assert you can't delete skill if active poster is using it
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, ['id' => $skill1->id])
            ->assertGraphQLValidationError('id', ApiError::SKILL_DELETE_IN_USE->name);

        $pool->update(['closing_date' => config('constants.past_datetime')]);

        // assert once poster is closed, you can delete the skill
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, ['id' => $skill1->id])
            ->assertJsonFragment(['id' => $skill1->id]);
    }

    public function testSkillsQueryIgnoresDeleted(): void
    {
        Skill::truncate();
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $query =
            /** @lang GraphQL */
            '
            query skills {
                skills {
                    id
              }
            }
        ';
        $mutation =
            /** @lang GraphQL */
            '
            mutation deleteSkill($id: UUID!) {
                deleteSkill(id: $id) {
                    id
                }
            }
        ';

        // assert querying for all skills does not fetch soft deleted
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query)
            ->assertJson(
                fn (AssertableJson $json) => $json->has(
                    'data.skills',
                    2
                )
            );
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, ['id' => $skill1->id])
            ->assertSuccessful();
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($query)
            ->assertJson(
                fn (AssertableJson $json) => $json->has(
                    'data.skills',
                    1
                )
            );
    }
}
