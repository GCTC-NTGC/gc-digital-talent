<?php

namespace Tests\Feature;

use App\Enums\PoolSkillType;
use App\Enums\SkillLevel;
use App\Models\Community;
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
        $community = Community::factory()->create();

        $this->baseUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($community->id)
            ->create();

        $this->adminUser = User::factory()
            ->asAdmin()
            ->create();

        $this->template = JobPosterTemplate::factory()
            ->withSkills()
            ->create();
    }

    public function testAnonymousUsersCanViewAny()
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

    public function testAnonymousUserCannotCreate()
    {
        $this->graphQL($this->create, [
            'template' => $this->getCreateInput(),
        ])->assertGraphQLErrorMessage('Unauthenticated.');
    }

    public function testNonAdminUserCannotCreate()
    {
        $this->actingAs($this->baseUser, 'api')->graphQL($this->create, [
            'template' => $this->getCreateInput(),
        ])->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testAdminCanCreate()
    {
        $res = $this->actingAs($this->adminUser, 'api')->graphQL($this->create, [
            'template' => $this->getCreateInput(),
        ]);

        $this->assertNotNull($res['data']['createJobPosterTemplate']);
    }

    public function testAnonymousUserCannotUpdate()
    {
        $this->graphQL($this->update, [
            'template' => [
                'id' => $this->template->id,
                'referenceId' => 'new_id',
            ],
        ])->assertGraphQLErrorMessage('Unauthenticated.');
    }

    public function testNonAdminUserCannotUpdate()
    {
        $this->actingAs($this->baseUser, 'api')->graphQL($this->update, [
            'template' => [
                'id' => $this->template->id,
                'referenceId' => 'new_ref',
            ],
        ])->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testAdminCanUpdate()
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

    public function testNonAdminUserCannotDelete()
    {
        $template = JobPosterTemplate::factory()->create();

        $this->actingAs($this->baseUser, 'api')->graphQL($this->delete, [
            'id' => $template->id,
        ])->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testAdminCanDelete()
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

    public function testReferenceIdIsUnique()
    {
        $input = $this->getCreateInput();
        $this->actingAs($this->adminUser, 'api')->graphQL($this->create, [
            'template' => [
                ...$input,
                'referenceId' => $this->template->reference_id,
            ],
        ])->assertGraphQLErrorMessage('Validation failed for the field [createJobPosterTemplate].');
    }

    public function testCannotAddEssentialSkillWithNoLevel()
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

    public function testCanAddEssentialSkillWithLevel()
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

    public function testCannotAddAssetSkillWithLevel()
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

    public function testCanAddAssetSkillWithNoLevel()
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
            'stream' => $template->stream,
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
