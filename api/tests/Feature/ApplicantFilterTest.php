<?php

namespace Tests\Feature;

use App\Models\ApplicantFilter;
use App\Models\ApplicantFilterPoolRecord;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\PoolSeeder;
use Database\Seeders\SkillSeeder;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

class ApplicantFilterTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use ClearsSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootClearsSchemaCache();

        // Create admin user we run tests as
        // Note: this extra user does change the results of a couple queries
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();
    }

    /**
     * Test that querying all ApplicantFilter returns correct number, with correct attributes.
     *
     * @return void
     */
    public function testQueryAllApplicantFilters()
    {
        $filters = ApplicantFilter::factory()->count(2)->create();

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query {
                applicantFilters {
                    id
                    hasDiploma
                    equity {
                        isWoman
                        hasDisability
                        isIndigenous
                        isVisibleMinority
                    }
                    languageAbility
                    operationalRequirements
                    locationPreferences
                    wouldAcceptTemporary
                }
            }
        '
        );
        $response->assertJson([
            'data' => [
                'applicantFilters' => [
                    [
                        'id' => $filters[0]->id,
                        'hasDiploma' => $filters[0]->has_diploma,
                        'equity' => [
                            'isWoman' => $filters[0]->is_woman,
                            'hasDisability' => $filters[0]->has_disability,
                            'isIndigenous' => $filters[0]->is_indigenous,
                            'isVisibleMinority' => $filters[0]->is_visible_minority
                        ],
                        'languageAbility' => $filters[0]->language_ability,
                        'operationalRequirements' => $filters[0]->operational_requirements,
                        'locationPreferences' => $filters[0]->location_preferences,
                        'wouldAcceptTemporary' => $filters[0]->would_accept_temporary,
                    ],
                    [
                        'id' => $filters[1]->id,
                        'hasDiploma' => $filters[1]->has_diploma,
                        'equity' => [
                            'isWoman' => $filters[1]->is_woman,
                            'hasDisability' => $filters[1]->has_disability,
                            'isIndigenous' => $filters[1]->is_indigenous,
                            'isVisibleMinority' => $filters[1]->is_visible_minority
                        ],
                        'languageAbility' => $filters[1]->language_ability,
                        'operationalRequirements' => $filters[1]->operational_requirements,
                        'locationPreferences' => $filters[1]->location_preferences,
                        'wouldAcceptTemporary' => $filters[1]->would_accept_temporary,
                    ],
                ],
            ],
        ]);
    }

    /**
     * Test that querying a single ApplicantFilter returns the right one, with correct attributes.
     *
     * @return void
     */
    public function testQueryApplicantFilterById()
    {
        $filters = ApplicantFilter::factory()->count(3)->create();

        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query ($id: ID!) {
                applicantFilter(id: $id) {
                    id
                    hasDiploma
                    equity {
                        isWoman
                        hasDisability
                        isIndigenous
                        isVisibleMinority
                    }
                    languageAbility
                    operationalRequirements
                    locationPreferences
                    wouldAcceptTemporary
                }
            }
        ',
            [
                'id' => $filters[1]->id,
            ]
        );
        $response->assertJson([
            'data' => [
                'applicantFilter' => [
                    'id' => $filters[1]->id,
                    'hasDiploma' => $filters[1]->has_diploma,
                    'equity' => [
                        'isWoman' => $filters[1]->is_woman,
                        'hasDisability' => $filters[1]->has_disability,
                        'isIndigenous' => $filters[1]->is_indigenous,
                        'isVisibleMinority' => $filters[1]->is_visible_minority
                    ],
                    'languageAbility' => $filters[1]->language_ability,
                    'operationalRequirements' => $filters[1]->operational_requirements,
                    'locationPreferences' => $filters[1]->location_preferences,
                    'wouldAcceptTemporary' => $filters[1]->would_accept_temporary,
                ],
            ],
        ]);
    }

    /**
     * Test that factory creates relationships correctly.
     */
    public function testFactoryRelationships()
    {
        // By default, factory doesn't add relationships.
        $filter = ApplicantFilter::factory()->create();

        $this->assertEquals(0, $filter->classifications()->count());
        $this->assertEquals(0, $filter->skills()->count());
        $this->assertEquals(0, $filter->pools()->count());
        $this->assertEquals(0, $filter->applicantFilterPoolRecords()->count());

        // Before we add relationships, we need to seed the related values
        $this->seed(ClassificationSeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(PoolSeeder::class);

        $filters = ApplicantFilter::factory()->withRelationships()->count(10)->create();
        $this->assertEquals(10, $filters->count());
        foreach ($filters as $filter) {
            $this->assertGreaterThan(0, $filter->classifications()->count());
            $this->assertGreaterThan(0, $filter->skills()->count());
            $this->assertGreaterThan(0, $filter->pools()->count());
            $this->assertGreaterThan(0, $filter->applicantFilterPoolRecords()->count());
        }

        // Test that the pool and applicantFilterPoolRecord relationships use the same underlying data.
        foreach ($filters as $filter) {
            $poolIds = $filter->pools->pluck('id')->toArray();
            $poolRecordPoolIds = $filter->applicantFilterPoolRecords->pluck('pool_id')->toArray();
            $this->assertEqualsCanonicalizing($poolIds, $poolRecordPoolIds);
        }
    }

    /**
     * Test that queried ApplicantFilters have the correct relationships.
     */
    public function testQueryRelationships()
    {
        // Before we add relationships, we need to seed the related values
        $this->seed(ClassificationSeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(PoolSeeder::class);

        $filters = ApplicantFilter::factory()->withRelationships()->count(10)->create();
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query {
                applicantFilters {
                    id
                    expectedClassifications {
                        id
                        name {
                            en
                            fr
                        }
                    }
                    skills {
                        id
                        name {
                            en
                            fr
                        }
                    }
                    pools {
                        id
                        name {
                            en
                            fr
                        }
                        key
                    }
                }
            }
        '
        );
        // Assert that each relationship collection has the right size.
        foreach ($response->json('data.applicantFilters') as $filter) {
            $this->assertCount($filters->find($filter['id'])->classifications->count(), $filter['expectedClassifications']);
            $this->assertCount($filters->find($filter['id'])->skills->count(), $filter['skills']);
            $this->assertCount($filters->find($filter['id'])->pools->count(), $filter['pools']);
        }

        // Assert that the content of at least one item in each collection is correct.
        $response->assertJson([
            'data' => [
                'applicantFilters' => [
                    [
                        'id' => $filters[0]->id,
                        'expectedClassifications' => [
                            [
                                'id' => $filters[0]->classifications->first()->id,
                                'name' => $filters[0]->classifications->first()->name,
                            ],
                        ],
                        'skills' => [
                            [
                                'id' => $filters[0]->skills->first()->id,
                                'name' => $filters[0]->skills->first()->name,
                            ],
                        ],
                        'pools' => [
                            [
                                'id' => $filters[0]->applicantFilterPoolRecords->first()->pool->id,
                                'name' => $filters[0]->applicantFilterPoolRecords->first()->pool->name,
                                'key' => $filters[0]->applicantFilterPoolRecords->first()->pool->key,
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }
}
