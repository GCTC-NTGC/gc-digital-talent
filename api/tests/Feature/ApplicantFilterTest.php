<?php

namespace Tests\Feature;

use App\Enums\LanguageAbility;
use App\Enums\PoolCandidateSearchStatus;
use App\Facades\Notify;
use App\Models\ApplicantFilter;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\PoolTestSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Database\Seeders\WorkStreamSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class ApplicantFilterTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications

        $this->seed([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
        ]);

        // Create super user we run tests as
        // Note: this extra user does change the results of a couple queries
        $this->adminUser = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);
    }

    /**
     * Transform an ApplicantFilter to an ApplicantFilterInput array.
     */
    protected function filterToInput(ApplicantFilter $filter)
    {
        $onlyId = function ($item) {
            return ['id' => $item->id];
        };

        return [
            'hasDiploma' => $filter->has_diploma,
            'equity' => [
                'isWoman' => $filter->is_woman,
                'hasDisability' => $filter->has_disability,
                'isIndigenous' => $filter->is_indigenous,
                'isVisibleMinority' => $filter->is_visible_minority,
            ],
            'languageAbility' => $filter->language_ability,
            'operationalRequirements' => $filter->operational_requirements,
            'locationPreferences' => $filter->location_preferences,
            'flexibleWorkLocations' => $filter->flexible_work_locations,
            'positionDuration' => $filter->position_duration,
            'skills' => $filter->skills->map($onlyId)->toArray(),
            'pools' => $filter->pools->map($onlyId)->toArray(),
            'qualifiedInWorkStreams' => $filter->qualifiedInWorkStreams->map($onlyId)->toArray(),
            'qualifiedInClassifications' => $filter->qualifiedInClassifications->map(function ($classification) {
                return [
                    'group' => $classification->group,
                    'level' => $classification->level,
                ];
            })->toArray(),
            'community' => ['id' => $filter->community->id],
        ];
    }

    protected function filterToCreateInput(ApplicantFilter $filter)
    {
        $input = $this->filterToInput($filter);
        $input['skills'] = [
            'sync' => $filter->skills->pluck('id')->toArray(),
        ];
        $input['pools'] = [
            'sync' => $filter->pools->pluck('id')->toArray(),
        ];
        $input['qualifiedInWorkStreams'] = [
            'sync' => $filter->qualifiedInWorkStreams->pluck('id')->toArray(),
        ];
        $input['qualifiedInClassifications'] = [
            'sync' => $filter->qualifiedInClassifications->pluck('id')->toArray(),
        ];
        $input['community'] = [
            'connect' => $filter->community->id,
        ];

        return $input;
    }

    protected function filterEnumToInput(array $filter, string $enumKey)
    {

        $input = [];
        if (isset($filter[$enumKey])) {
            foreach ($filter[$enumKey] as $localizedEnum) {
                $input[] = $localizedEnum['value'];
            }
        }

        return $input;
    }

    /**
     * Test that querying an applicantFilter returns with correct attributes.
     *
     * @return void
     */
    public function testQueryApplicantFilter()
    {
        $filter = ApplicantFilter::factory()->create();
        $request = PoolCandidateSearchRequest::factory()->create([
            'applicant_filter_id' => $filter->id,
        ]);

        $response = $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query poolCandidateSearchRequest($id: ID!) {
                poolCandidateSearchRequest(id: $id) {
                    applicantFilter {
                        id
                        hasDiploma
                        equity {
                            isWoman
                            hasDisability
                            isIndigenous
                            isVisibleMinority
                        }
                        languageAbility { value }
                        operationalRequirements { value }
                        locationPreferences { value }
                        flexibleWorkLocations { value}
                        positionDuration
                    }
                }
            }

        ',
            [
                'id' => $request->id,
            ]
        );

        $expectedOperationalRequirements = [];
        if ($filter->operational_requirements) {
            foreach ($filter->operational_requirements as $requirement) {
                $expectedOperationalRequirements[] = [
                    'value' => $requirement,
                ];
            }
        } else {
            $expectedOperationalRequirements = null;
        }
        $expectedLocationPreferences = [];
        if ($filter->location_preferences) {
            foreach ($filter->location_preferences as $preference) {
                if ($preference) {
                    $expectedLocationPreferences[] = [
                        'value' => $preference,
                    ];
                }
            }
        } else {
            $expectedLocationPreferences = null;
        }

        $expectedFlexibleWorkLocations = [];
        if ($filter->flexible_work_locations) {
            foreach ($filter->flexible_work_locations as $loc) {
                if ($loc) {
                    $expectedFlexibleWorkLocations[] = [
                        'value' => $loc,
                    ];
                }
            }
        } else {
            $expectedFlexibleWorkLocations = null;
        }

        $response->assertJsonFragment([
            'applicantFilter' => [
                'id' => $filter->id,
                'hasDiploma' => $filter->has_diploma,
                'equity' => [
                    'isWoman' => $filter->is_woman,
                    'hasDisability' => $filter->has_disability,
                    'isIndigenous' => $filter->is_indigenous,
                    'isVisibleMinority' => $filter->is_visible_minority,
                ],
                'languageAbility' => [
                    'value' => $filter->language_ability,
                ],
                'operationalRequirements' => $expectedOperationalRequirements,
                'locationPreferences' => $expectedLocationPreferences,
                'flexibleWorkLocations' => $expectedFlexibleWorkLocations,
                'positionDuration' => $filter->position_duration,
            ],
        ]);
    }

    /**
     * Test that factory creates relationships correctly.
     */
    public function testFactoryRelationships()
    {

        // Before we add relationships, we need to seed the related values
        $this->seed([
            ClassificationSeeder::class,
            CommunitySeeder::class,
            WorkStreamSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            PoolTestSeeder::class,
        ]);

        // By default, factory doesn't add relationships.
        $filter = ApplicantFilter::factory()->create();

        $this->assertEquals(0, $filter->classifications()->count());
        $this->assertEquals(0, $filter->skills()->count());
        $this->assertEquals(0, $filter->pools()->count());

        $filters = ApplicantFilter::factory()->withRelationships()->count(10)->create();
        $this->assertEquals(10, $filters->count());
        foreach ($filters as $filter) {
            $this->assertGreaterThan(0, $filter->classifications()->count());
            $this->assertGreaterThan(0, $filter->skills()->count());
            $this->assertGreaterThan(0, $filter->pools()->count());
            $this->assertGreaterThan(0, $filter->community()->count());
        }
    }

    /**
     * Test that queried ApplicantFilter has the correct relationships.
     */
    public function testQueryRelationships()
    {
        // Before we add relationships, we need to seed the related values
        $this->seed([
            ClassificationSeeder::class,
            CommunitySeeder::class,
            WorkStreamSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            PoolTestSeeder::class,
        ]);

        $filter = ApplicantFilter::factory()->withRelationships()->create();
        $request = PoolCandidateSearchRequest::factory()->create([
            'applicant_filter_id' => $filter->id,
        ]);
        $response = $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query poolCandidateSearchRequest($id: ID!) {
                poolCandidateSearchRequest(id: $id) {
                    applicantFilter {
                        id
                        skills {
                            id
                            name {
                                en
                                fr
                                localized
                            }
                        }
                        pools {
                            id
                            name {
                                en
                                fr
                                localized
                            }
                        }
                        qualifiedInWorkStreams { id }
                        qualifiedInClassifications {
                            id
                            name {
                                en
                                fr
                                localized
                            }
                        }
                        community {
                            id
                        }
                    }
                }
            }
        ',
            [
                'id' => $request->id,
            ]
        );
        // Assert that each relationship collection has the right size.
        $retrievedFilter = $response->json('data.poolCandidateSearchRequest.applicantFilter');
        $this->assertCount($filter->qualifiedInClassifications->count(), $retrievedFilter['qualifiedInClassifications']);
        $this->assertCount($filter->skills->count(), $retrievedFilter['skills']);
        $this->assertCount($filter->pools->count(), $retrievedFilter['pools']);
        $this->assertCount($filter->qualifiedInWorkStreams->count(), $retrievedFilter['qualifiedInWorkStreams']);

        // Assert that all the content in each collection is correct.
        foreach ($filter->pools as $pool) {
            $response->assertJsonFragment(['id' => $pool->id, 'name' => $pool->name]);
        }
        foreach ($filter->qualifiedInClassifications as $qualifiedClassification) {
            $response->assertJsonFragment([
                'id' => $qualifiedClassification->id,
                'name' => $qualifiedClassification->name,
            ]);
        }
        foreach ($filter->skills as $skill) {
            $response->assertJsonFragment(['id' => $skill->id, 'name' => $skill->name]);
        }

        foreach ($filter->qualifiedInWorkStreams as $workStream) {
            $response->assertJsonFragment([
                'id' => $workStream->id,
            ]);
        }
        $response->assertJsonFragment(['community' => ['id' => $filter->community_id]]);
    }

    /**
     * Test that a PoolCandidateSearchRequest can be created, containing an ApplicantFilter
     */
    public function testCanCreateARequest()
    {
        // Seed everything required
        $this->seed(CommunitySeeder::class);
        $this->seed(ClassificationSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        $filter = ApplicantFilter::factory()->withRelationships()->create();

        // make a request to pull fake data from - don't save it in DB.
        $request = PoolCandidateSearchRequest::factory()->make([
            'pool_candidate_filter_id' => null,
            'applicant_filter_id' => null,
        ]);
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            mutation createSearchRequest($request: CreatePoolCandidateSearchRequestInput!) {
                createPoolCandidateSearchRequest(poolCandidateSearchRequest: $request) {
                    id
                    email
                    fullName
                    jobTitle
                    managerJobTitle
                    positionType { value }
                    status { value }
                    reason { value }
                    department {
                        id
                    }
                }
            }
        ',
            [
                'request' => [
                    'fullName' => $request->full_name,
                    'email' => $request->email,
                    'department' => [
                        'connect' => $request->department_id,
                    ],
                    'community' => [
                        'connect' => $request->community_id,
                    ],
                    'jobTitle' => $request->job_title,
                    'managerJobTitle' => $request->manager_job_title,
                    'positionType' => $request->position_type,
                    'reason' => $request->reason,
                    'applicantFilter' => [
                        'create' => $this->filterToCreateInput($filter),
                    ],
                ],
            ]
        );
        $response->assertJson([
            'data' => [
                'createPoolCandidateSearchRequest' => [
                    'email' => $request->email,
                    'fullName' => $request->full_name,
                    'jobTitle' => $request->job_title,
                    'managerJobTitle' => $request->manager_job_title,
                    'positionType' => [
                        'value' => $request->position_type,
                    ],
                    'reason' => [
                        'value' => $request->reason,
                    ],
                    'status' => [
                        'value' => PoolCandidateSearchStatus::NEW->name,
                    ],
                    'department' => [
                        'id' => $request->department_id,
                    ],
                ],
            ],
        ]);
    }

    /**
     * Test that we can use an ApplicantFilter in a search, save it as part of a PoolCandidateSearchRequest, retrieve it, and get the same results again.
     */
    public function testFilterCanBeStoredAndRetrievedWithoutChangingResults()
    {
        // Seed everything used in generating Users
        $this->seed([
            ClassificationSeeder::class,
            CommunitySeeder::class,
            GenericJobTitleSeeder::class,
            WorkStreamSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            PoolTestSeeder::class,
        ]);

        $community = Community::where('key', 'digital')->first();
        $pool = Pool::factory()
            ->candidatesAvailableInSearch()
            ->create([
                'name' => [
                    'en' => 'Test Pool EN',
                    'fr' => 'Test Pool FR',
                ],
                'community_id' => $community->id,
            ]);
        // Create candidates who may show up in searches
        $candidates = PoolCandidate::factory()->count(10)->availableInSearch()->create([
            'pool_id' => $pool->id,
            'user_id' => User::factory()->withNonGovProfile(),
        ]);

        // Generate a filter that matches at least one candidate
        $candidate = $candidates->random();
        $filterLanguage = null; // run through fields and assign the enum for the first one that is true
        if ($candidate->looking_for_english) {
            $filterLanguage = LanguageAbility::ENGLISH->name;
        } elseif ($candidate->looking_for_french) {
            $filterLanguage = LanguageAbility::FRENCH->name;
        } elseif ($candidate->looking_for_bilingual) {
            $filterLanguage = LanguageAbility::BILINGUAL->name;
        }
        $filter = ApplicantFilter::factory()->create(
            [
                'has_diploma' => $candidate->user->has_diploma,
                'has_disability' => $candidate->user->has_disability,
                'is_indigenous' => ! empty($candidate->user->indigenous_communities),
                'is_visible_minority' => $candidate->user->is_visible_minority,
                'is_woman' => $candidate->user->is_woman,
                'position_duration' => $candidate->user->position_duration,
                'language_ability' => $filterLanguage,
                'location_preferences' => $candidate->user->location_preferences,
                'flexible_work_locations' => $candidate->user->flexible_work_locations,
                'operational_requirements' => $candidate->user->accepted_operational_requirements,
                'community_id' => $community->id,
            ]
        );
        $filter->qualifiedInClassifications()->saveMany([$pool->classification]);
        $candidateUser = User::with([
            'awardExperiences',
            'awardExperiences.skills',
            'communityExperiences',
            'communityExperiences.skills',
            'educationExperiences',
            'educationExperiences.skills',
            'personalExperiences',
            'personalExperiences.skills',
            'workExperiences',
            'workExperiences.skills',
        ])->find($candidate->user_id);
        $candidateSkills = $candidateUser->experiences[0]->skills;
        $filter->skills()->saveMany($candidateSkills->shuffle()->take(3));
        $filter->pools()->save($pool);
        $filter->qualifiedInWorkStreams()->saveMany([$pool->workStream]);
        $filter->save();
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => $this->filterToInput($filter),
            ]
        );
        // Sanity check - we should have at least one candidate in the filter.
        $firstCount = $response->json('data.countApplicantsForSearch');
        $this->assertGreaterThan(0, $firstCount);

        // Store the filter with a search request

        // make a request to pull fake data from - don't save it in DB.
        $request = PoolCandidateSearchRequest::factory()->make([
            'pool_candidate_filter_id' => null,
            'applicant_filter_id' => null,
            'community_id' => $community->id,
        ]);
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            mutation createSearchRequest($request: CreatePoolCandidateSearchRequestInput!) {
                createPoolCandidateSearchRequest(poolCandidateSearchRequest: $request) {
                    id
                }
            }
        ',
            [
                'request' => [
                    'fullName' => $request->full_name,
                    'email' => $request->email,
                    'department' => [
                        'connect' => $request->department_id,
                    ],
                    'community' => [
                        'connect' => $request->community_id,
                    ],
                    'jobTitle' => $request->job_title,
                    'managerJobTitle' => $request->manager_job_title,
                    'positionType' => $request->position_type,
                    'reason' => $request->reason,
                    'applicantFilter' => [
                        'create' => $this->filterToCreateInput($filter),
                    ],
                ],
            ]
        );
        $requestId = $response->json('data.createPoolCandidateSearchRequest.id');
        $response = $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query poolCandidateSearchRequest($id: ID!) {
                poolCandidateSearchRequest(id: $id) {
                    applicantFilter {
                        hasDiploma
                        equity {
                            isWoman
                            hasDisability
                            isIndigenous
                            isVisibleMinority
                        }
                        languageAbility { value }
                        locationPreferences { value }
                        flexibleWorkLocations { value }
                        operationalRequirements { value }
                        positionDuration
                        qualifiedInWorkStreams { id }
                        qualifiedInClassifications {
                            group
                            level
                        }
                        skills {
                            id
                        }
                        pools {
                            id
                        }
                        community {
                            id
                        }
                    }
                }
            }
        ',
            [
                'id' => $requestId,
            ]
        );
        $retrievedFilter = $response->json('data.poolCandidateSearchRequest.applicantFilter');

        $retrievedFilter['locationPreferences'] = $this->filterEnumToInput($retrievedFilter, 'locationPreferences');
        $retrievedFilter['flexibleWorkLocations'] = $this->filterEnumToInput($retrievedFilter, 'flexibleWorkLocations');
        $retrievedFilter['operationalRequirements'] = $this->filterEnumToInput($retrievedFilter, 'operationalRequirements');

        // Now use the retrieved filter to get the same count
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => $retrievedFilter,
            ]
        );
        $this->assertEquals($firstCount, $response->json('data.countApplicantsForSearch'));
    }
}
