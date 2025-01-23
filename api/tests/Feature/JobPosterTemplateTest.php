<?php

namespace Tests\Feature;

use App\Enums\PoolSkillType;
use App\Enums\SkillLevel;
use App\Models\JobPosterTemplate;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Database\Seeders\WorkStreamSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class JobPosterTemplateTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    private User $adminUser;

    private User $baseUser;

    private JobPosterTemplate $template;

    private string $queryOne = <<<'GRAPHQL'
        query One($id: UUID!) {
            jobPosterTemplate(id: $id) { id }
        }
    GRAPHQL;

    private string $queryAll = <<<'GRAPHQL'
        query All {
            jobPosterTemplates { id }
        }
    GRAPHQL;

    private string $create = <<<'GRAPHQL'
        mutation Create($template: CreateJobPosterTemplateInput!) {
            createJobPosterTemplate(jobPosterTemplate: $template) {
                id
        }
    }
    GRAPHQL;

    private string $update = <<<'GRAPHQL'
        mutation Update($template: UpdateJobPosterTemplateInput!) {
            updateJobPosterTemplate(jobPosterTemplate: $template) {
                id
                referenceId
            }
        }
    GRAPHQL;

    private string $delete = <<<'GRAPHQL'
        mutation Delete($id: UUID!) {
            deleteJobPosterTemplate(id: $id) {
                id
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            ClassificationSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            CommunitySeeder::class,
            WorkStreamSeeder::class,
        ]);

        // Add a few elevated roles to confirm unauthorized
        $this->baseUser = User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->asCommunityManager()
            ->create();

        $this->adminUser = User::factory()
            ->asAdmin()
            ->create();

        $this->template = JobPosterTemplate::factory()
            ->withSkills()
            ->create();
    }

    public function test_anonymous_users_can_view_any()
    {
        $this->graphQL($this->queryOne, [
            'id' => $this->template->id,
        ])
            ->assertJson([
                'data' => [
                    'jobPosterTemplate' => [
                        'id' => $this->template->id,
                    ],
                ],
            ]);

        $this->graphQL($this->queryAll)
            ->assertJson([
                'data' => [
                    'jobPosterTemplates' => [[
                        'id' => $this->template->id,
                    ]],
                ],
            ]);
    }

    public function test_anonymous_user_cannot_create()
    {
        $this->graphQL($this->create, [
            'template' => $this->getCreateInput(),
        ])->assertGraphQLErrorMessage('Unauthenticated.');
    }

    public function test_non_admin_user_cannot_create()
    {
        $this->actingAs($this->baseUser, 'api')->graphQL($this->create, [
            'template' => $this->getCreateInput(),
        ])->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function test_admin_can_create()
    {
        $res = $this->actingAs($this->adminUser, 'api')->graphQL($this->create, [
            'template' => $this->getCreateInput(),
        ]);

        $this->assertNotNull($res['data']['createJobPosterTemplate']);
    }

    public function test_anonymous_user_cannot_update()
    {
        $this->graphQL($this->update, [
            'template' => [
                'id' => $this->template->id,
                'referenceId' => 'new_id',
            ],
        ])->assertGraphQLErrorMessage('Unauthenticated.');
    }

    public function test_non_admin_user_cannot_update()
    {
        $this->actingAs($this->baseUser, 'api')->graphQL($this->update, [
            'template' => [
                'id' => $this->template->id,
                'referenceId' => 'new_ref',
            ],
        ])->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function test_admin_can_update()
    {
        $this->actingAs($this->adminUser, 'api')->graphQL($this->update, [
            'template' => [
                'id' => $this->template->id,
                'referenceId' => 'new_ref',
            ],
        ])->assertJson([
            'data' => [
                'updateJobPosterTemplate' => [
                    'id' => $this->template->id,
                    'referenceId' => 'new_ref',
                ],
            ],
        ]);
    }

    public function test_non_admin_user_cannot_delete()
    {
        $template = JobPosterTemplate::factory()->create();

        $this->actingAs($this->baseUser, 'api')->graphQL($this->delete, [
            'id' => $template->id,
        ])->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function test_admin_can_delete()
    {
        $template = JobPosterTemplate::factory()->create();

        $this->actingAs($this->adminUser, 'api')->graphQL($this->delete, [
            'id' => $template->id,
        ])->assertJson([
            'data' => [
                'deleteJobPosterTemplate' => [
                    'id' => $template->id,
                ],
            ],
        ]);
    }

    public function test_reference_id_is_unique()
    {
        $input = $this->getCreateInput();
        $this->actingAs($this->adminUser, 'api')->graphQL($this->create, [
            'template' => [
                ...$input,
                'referenceId' => $this->template->reference_id,
            ],
        ])->assertGraphQLErrorMessage('Validation failed for the field [createJobPosterTemplate].');
    }

    public function test_cannot_add_essential_skill_with_no_level()
    {
        $input = $this->getCreateInput();
        $this->actingAs($this->adminUser, 'api')->graphQL($this->create, [
            'template' => [
                ...$input,
                'skills' => [
                    'connect' => [
                        [
                            'id' => $this->template->skills[0]->id,
                            'type' => PoolSkillType::ESSENTIAL->name,
                            'requiredLevel' => null,
                        ],
                    ],
                ],
            ],
        ])->assertGraphQLErrorMessage('Validation failed for the field [createJobPosterTemplate].');
    }

    public function test_can_add_essential_skill_with_level()
    {
        $input = $this->getCreateInput();
        $res = $this->actingAs($this->adminUser, 'api')->graphQL($this->create, [
            'template' => [
                ...$input,
                'skills' => [
                    'connect' => [
                        [
                            'id' => $this->template->skills[0]->id,
                            'type' => PoolSkillType::ESSENTIAL->name,
                            'requiredLevel' => SkillLevel::ADVANCED->name,
                        ],
                    ],
                ],
            ],
        ]);

        $this->assertNotNull($res['data']['createJobPosterTemplate']);
    }

    public function test_cannot_add_asset_skill_with_level()
    {
        $input = $this->getCreateInput();
        $this->actingAs($this->adminUser, 'api')->graphQL($this->create, [
            'template' => [
                ...$input,
                'skills' => [
                    'connect' => [
                        [
                            'id' => $this->template->skills[0]->id,
                            'type' => PoolSkillType::NONESSENTIAL->name,
                            'requiredLevel' => SkillLevel::ADVANCED->name,
                        ],
                    ],
                ],
            ],
        ])->assertGraphQLErrorMessage('Validation failed for the field [createJobPosterTemplate].');
    }

    public function test_can_add_asset_skill_with_no_level()
    {
        $input = $this->getCreateInput();
        $res = $this->actingAs($this->adminUser, 'api')->graphQL($this->create, [
            'template' => [
                ...$input,
                'skills' => [
                    'connect' => [
                        [
                            'id' => $this->template->skills[0]->id,
                            'type' => PoolSkillType::NONESSENTIAL->name,
                            'requiredLevel' => null,
                        ],
                    ],
                ],
            ],
        ]);

        $this->assertNotNull($res['data']['createJobPosterTemplate']);
    }

    private function getCreateInput(): array
    {
        $template = JobPosterTemplate::factory()->make();

        return [
            'referenceId' => $template->reference_id,
            'name' => Arr::only($template->name, ['en', 'fr']),
            'description' => Arr::only($template->description, ['en', 'fr']),
            'supervisoryStatus' => $template->supervisory_status,
            'tasks' => Arr::only($template->tasks, ['en', 'fr']),
            'workDescription' => Arr::only($template->work_description, ['en', 'fr']),
            'keywords' => Arr::only($template->keywords, ['en', 'fr']),
            'essentialBehaviouralSkillsNotes' => Arr::only($template->essential_behavioural_skills_notes, ['en', 'fr']),
            'essentialTechnicalSkillsNotes' => Arr::only($template->essential_technical_skills_notes, ['en', 'fr']),
            'nonessentialTechnicalSkillsNotes' => Arr::only($template->nonessential_technical_skills_notes, ['en', 'fr']),
            'classification' => [
                'connect' => $template->classification->id,
            ],
            'workStream' => [
                'connect' => $template->workStream->id,
            ],
            'skills' => [
                'connect' => $template->skills->map(function ($skill) {
                    return [
                        'id' => $skill->id,
                        'requiredLevel' => $skill->required_skill_level,
                        'type' => $skill->type,
                    ];
                }),
            ],
        ];
    }
}
