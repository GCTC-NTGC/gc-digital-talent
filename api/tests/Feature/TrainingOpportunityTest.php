<?php

namespace Tests\Feature;

use App\Enums\CourseFormat;
use App\Enums\CourseLanguage;
use App\Models\TrainingOpportunity;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\Concerns\InteractsWithExceptionHandling;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TrainingOpportunityTest extends TestCase
{
    use InteractsWithExceptionHandling;
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();
        $this->withoutExceptionHandling();
        $this->seed(ClassificationSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->admin = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);
    }

    public function testQueryingPaginatedDeadlineScope(): void
    {
        $old = TrainingOpportunity::factory()->create([
            'registration_deadline' => config('constants.past_date'),
        ]);
        $future = TrainingOpportunity::factory()->create([
            'registration_deadline' => config('constants.far_future_date'),
        ]);

        // empty filter input returns 2
        $this->graphQL(
            /** @lang GraphQL */
            '
            query trainingOpportunitiesPaginated($where: TrainingOpportunitiesFilterInput) {
                trainingOpportunitiesPaginated(where: $where) {
                    data {
                        id
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
            ',
            []
        )->assertJsonFragment(
            [
                'id' => $future->id,
            ],
        )
            ->assertJsonFragment(
                [
                    'id' => $old->id,
                ],
            )
            ->assertJsonFragment(
                [
                    'total' => 2,
                ],
            );

        // false returns 2
        $this->graphQL(
            /** @lang GraphQL */
            '
            query trainingOpportunitiesPaginated($where: TrainingOpportunitiesFilterInput) {
                trainingOpportunitiesPaginated(where: $where) {
                    data {
                        id
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
            ',
            [
                'where' => [
                    'hidePassedRegistrationDeadline' => false,
                ],
            ]
        )->assertJsonFragment(
            [
                'id' => $future->id,
            ],
        )
            ->assertJsonFragment(
                [
                    'id' => $old->id,
                ],
            )
            ->assertJsonFragment(
                [
                    'total' => 2,
                ],
            );

        // true causes filtering, returning 1, the future opportunity
        $this->graphQL(
            /** @lang GraphQL */
            '
            query trainingOpportunitiesPaginated($where: TrainingOpportunitiesFilterInput) {
                trainingOpportunitiesPaginated(where: $where) {
                    data {
                        id
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
            ',
            [
                'where' => [
                    'hidePassedRegistrationDeadline' => true,
                ],
            ]
        )->assertJsonFragment(
            [
                'id' => $future->id,
            ],
        )
            ->assertJsonFragment(
                [
                    'total' => 1,
                ],
            );
    }

    public function testQueryingPaginatedCourseLanguage(): void
    {
        $english = TrainingOpportunity::factory()->create([
            'course_language' => CourseLanguage::ENGLISH->name,
        ]);
        $french = TrainingOpportunity::factory()->create([
            'course_language' => CourseLanguage::FRENCH->name,
        ]);
        $bilingual = TrainingOpportunity::factory()->create([
            'course_language' => CourseLanguage::BILINGUAL->name,
        ]);

        // empty filter input returns all 3
        $this->graphQL(
            /** @lang GraphQL */
            '
            query trainingOpportunitiesPaginated($where: TrainingOpportunitiesFilterInput) {
                trainingOpportunitiesPaginated(where: $where) {
                    data {
                        id
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
            ',
            []
        )->assertJsonFragment(
            [
                'id' => $english->id,
            ],
        )
            ->assertJsonFragment(
                [
                    'id' => $french->id,
                ],
            )
            ->assertJsonFragment(
                [
                    'id' => $bilingual->id,
                ],
            )
            ->assertJsonFragment(
                [
                    'total' => 3,
                ],
            );

        // english returns 1, english
        $this->graphQL(
            /** @lang GraphQL */
            '
            query trainingOpportunitiesPaginated($where: TrainingOpportunitiesFilterInput) {
                trainingOpportunitiesPaginated(where: $where) {
                    data {
                        id
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
            ',
            [
                'where' => [
                    'opportunityLanguage' => CourseLanguage::ENGLISH->name,
                ],
            ]
        )->assertJsonFragment(
            [
                'id' => $english->id,
            ],
        )
            ->assertJsonFragment(
                [
                    'total' => 2,
                ],
            );

        // french returns 1, french
        $this->graphQL(
            /** @lang GraphQL */
            '
            query trainingOpportunitiesPaginated($where: TrainingOpportunitiesFilterInput) {
                trainingOpportunitiesPaginated(where: $where) {
                    data {
                        id
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
            ',
            [
                'where' => [
                    'opportunityLanguage' => CourseLanguage::FRENCH->name,
                ],
            ]
        )->assertJsonFragment(
            [
                'id' => $french->id,
            ],
        )
            ->assertJsonFragment(
                [
                    'total' => 2,
                ],
            );
    }

    // test that a training opportunity is successfully created
    public function testCreateTrainingOpportunity(): void
    {
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
        mutation createTrainingOpportunity($createTrainingOpportunity: CreateTrainingOpportunityInput!) {
            createTrainingOpportunity(createTrainingOpportunity: $createTrainingOpportunity) {
                title {
                    en
                    fr
                }
                registrationDeadline
                courseLanguage {
                    value
                }
            }
        }
        ',
            [
                'createTrainingOpportunity' => [
                    'title' => ['en' => 'EN', 'fr' => 'FR'],
                    'description' => ['en' => 'EN', 'fr' => 'FR'],
                    'applicationUrl' => ['en' => 'EN/', 'fr' => 'FR/'],
                    'registrationDeadline' => config('constants.far_future_date'),
                    'trainingStart' => config('constants.far_future_date'),
                    'courseLanguage' => CourseLanguage::ENGLISH->name,
                    'courseFormat' => CourseFormat::VIRTUAL->name,
                ],
            ]
        )->assertJsonFragment(
            [
                'title' => [
                    'en' => 'EN',
                    'fr' => 'FR',
                ],
            ],
        )->assertJsonFragment(
            [
                'registrationDeadline' => config('constants.far_future_date'),
            ],
        )->assertJsonFragment(
            [
                'courseLanguage' => [
                    'value' => CourseLanguage::ENGLISH->name,
                ],
            ],
        );
    }

    // test that a training opportunity is successfully updated
    public function testUpdateTrainingOpportunity(): void
    {
        $opportunity = TrainingOpportunity::factory()->create();

        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
        mutation updateTrainingOpportunity($updateTrainingOpportunity: UpdateTrainingOpportunityInput!) {
            updateTrainingOpportunity(updateTrainingOpportunity: $updateTrainingOpportunity) {
                title {
                    en
                    fr
                }
                courseLanguage {
                    value
                }
            }
        }
        ',
            [
                'updateTrainingOpportunity' => [
                    'id' => $opportunity->id,
                    'title' => ['en' => 'EN', 'fr' => 'FR'],
                    'courseLanguage' => CourseLanguage::ENGLISH->name,
                ],
            ]
        )->assertJsonFragment(
            [
                'title' => [
                    'en' => 'EN',
                    'fr' => 'FR',
                ],
            ],
        )->assertJsonFragment(
            [
                'courseLanguage' => [
                    'value' => CourseLanguage::ENGLISH->name,
                ],
            ],
        );
    }
}
