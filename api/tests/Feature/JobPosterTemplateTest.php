<?php

namespace Tests\Feature;

use App\Models\JobPosterTemplate;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
        mutation Update($id: UUID!, $template: UpdateJobPosterTemplateInput!) {
            updateJobPosterTemplate(id: $id, jobPosterTemplate: $template) {
                id
                referenceId
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
            'id' => $this->template->id,
            'template' => ['referenceId' => 'new_id'],
        ])->assertGraphQLErrorMessage('Unauthenticated.');
    }

    public function testNonAdminUserCannotUpdate()
    {
        $this->actingAs($this->baseUser, 'api')->graphQL($this->update, [
            'id' => $this->template->id,
            'template' => ['referenceId' => 'new_ref'],
        ])->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testAdminCanUpdate()
    {
        $this->actingAs($this->adminUser, 'api')->graphQL($this->update, [
            'id' => $this->template->id,
            'template' => ['referenceId' => 'new_ref'],
        ])->assertJson([
            'data' => [
                'updateJobPosterTemplate' => [
                    'id' => $this->template->id,
                    'referenceId' => 'new_ref',
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

    private function getCreateInput(): array
    {
        $template = JobPosterTemplate::factory()->make();

        return [
            'referenceId' => $template->reference_id,
            'name' => $template->name,
            'description' => $template->description,
            'supervisoryStatus' => $template->supervisory_status,
            'stream' => $template->stream,
            'tasks' => $template->tasks,
            'workDescription' => $template->work_description,
            'keywords' => $template->keywords,
            'essentialBehaviouralSkillsNotes' => $template->essential_behavioural_skills_notes,
            'essentialTechnicalSkillsNotes' => $template->essential_technical_skills_notes,
            'nonessentialTechnicalSkillsNotes' => $template->nonessential_technical_skills_notes,
            'classification' => [
                'connect' => $template->classification->id,
            ],
            'skills' => [
                'attach' => $template->skills->map(function ($skill) {
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
