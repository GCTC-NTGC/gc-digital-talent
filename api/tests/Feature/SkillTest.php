<?php

namespace Tests\Feature;

use App\Models\CommunityExperience;
use App\Models\ExperienceSkill;
use App\Models\Skill;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class SkillTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
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
    public function test_view_any_skill()
    {
        $this->graphQL('query { skills { id } }')
            ->assertJsonFragment(['id' => $this->uuid]);
    }

    /**
     * Test guest user can view any
     *
     * @return void
     */
    public function test_view_skill()
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
    public function test_update_skill()
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
    public function test_create_skill()
    {
        $variables = [
            'skill' => [
                'key' => 'key',
                'name' => [
                    'en' => 'New Name (EN)',
                    'fr' => 'New Name (FR)',
                ],
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
}
