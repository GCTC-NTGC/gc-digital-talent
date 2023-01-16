<?php

use App\Models\Classification;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;
use Database\Helpers\UuidHelpers;

class PoolCandidateTest extends TestCase
{
  use RefreshDatabase;
  use MakesGraphQLRequests;
  use ClearsSchemaCache;

  protected function setUp(): void
  {
    parent::setUp();
    $this->bootClearsSchemaCache();
  }

  public function testFilterByClassification(): void
  {

    // Create initial data.
    Classification::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create([
      'user_id' => User::factory([
        'expected_salary' => [], // remove salaries to avoid accidental classification-to-salary matching
      ]),
      'expiry_date' => config('constants.far_future_date'), // ensure no candidates are expired for this test
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, // ensure availability doesn't effect test
    ]);

    // Create new classification and attach to two new pool candidates.
    $classification = Classification::factory()->create([
      'group' => 'ZZ',
      'level' => 1,
    ]);
    PoolCandidate::factory()->count(2)->create([
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ])->each(function($candidate) use ($classification) {
      $candidate->user->expectedClassifications()->save($classification);
    });

    // Assert query with no classifications filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);

    // Assert query with classification filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'expectedClassifications' => [['group' => 'ZZ', 'level' => 1 ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown classification filter will return zero
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }
  public function testFilterByOperationalRequirements(): void
  {
    // Create initial data.
    PoolCandidate::factory()->count(5)->create([
      'user_id' => User::factory([
        'accepted_operational_requirements' => null,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, // ensure no candidates are expired for this test
    ]);
    $operationalRequirement1 = 'OVERTIME_SCHEDULED';
    $operationalRequirement2 = 'SHIFT_WORK';
    $operationalRequirement3 = 'ON_CALL';

    // Create a few with a op_req 1
    PoolCandidate::factory()->count(2)->create([
      'user_id' => User::factory([
        'accepted_operational_requirements' => [$operationalRequirement1],
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Create a few with op_req 1 and 2
    PoolCandidate::factory()->count(2)->create([
      'user_id' => User::factory([
        'accepted_operational_requirements' => [$operationalRequirement1, $operationalRequirement2],
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Assert query with no operationalRequirements filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 9
      ]
    ]);

     // Assert query with empty operationalRequirements filter will return all candidates
     $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'operationalRequirements' => []
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 9
      ]
    ]);

    // Assert query with one operationalRequirement filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'operationalRequirements' => [ $operationalRequirement1 ],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 4
      ]
    ]);

    // Assert query with two operationalRequirement filters will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'operationalRequirements' => [ $operationalRequirement1, $operationalRequirement2 ],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with an unused operationalRequirement filter will return zero
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'operationalRequirements' => [$operationalRequirement3],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);

  }

  public function testFilterByPool(): void
  {

    // Create initial data.
    Pool::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create(['expiry_date' => config('constants.far_future_date'), 'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,]);

    // Create new pool and attach to two new pool candidates.
    $pool = Pool::factory()->create();
    PoolCandidate::factory()->count(2)->create(['expiry_date' => config('constants.far_future_date'), 'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,])->each(function($candidate) use ($pool) {
      $candidate->pool()->associate($pool);
      $candidate->save();
    });

    // Assert query with no pool filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);

    // Assert query with pool filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'pools' => [[ 'id' => $pool['id'] ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown pool filter will return zero
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'pools' => [[ 'id' => '00000000-0000-0000-0000-000000000000' ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByDiploma(): void
  {

    // Create initial set of 5 candidates with no diploma.
    PoolCandidate::factory()->count(5)->create([
      'user_id' => User::factory([
        'has_diploma' => false,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Create two new pool candidates with a diploma.
    PoolCandidate::factory()->count(2)->create([
      'user_id' => User::factory([
        'has_diploma' => true,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Assert query no hasDiploma filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);

    // Assert query with hasDiploma filter set to true will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'hasDiploma' => true,
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with hasDiploma filter set to false will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'hasDiploma' => false,
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);
  }

  public function testFilterByEmploymentEquity(): void
  {

     // Create initial data.
     PoolCandidate::factory()->count(5)->create([
      'user_id' => User::factory([
        'has_disability' => false,
        'indigenous_communities' => null,
        'is_visible_minority' => false,
        'is_woman' => false,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Create one new candidate for each EmploymentEquity filter
    PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'has_disability' => true,
        'indigenous_communities' => null,
        'is_visible_minority' => false,
        'is_woman' => false,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'has_disability' => false,
        'indigenous_communities' => [ApiEnums::INDIGENOUS_LEGACY_IS_INDIGENOUS],
        'is_visible_minority' => false,
        'is_woman' => false,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'has_disability' => false,
        'indigenous_communities' => null,
        'is_visible_minority' => true,
        'is_woman' => false,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'has_disability' => false,
        'indigenous_communities' => null,
        'is_visible_minority' => false,
        'is_woman' => true,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Assert query with no EmploymentEquity filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 9
      ]
    ]);

    // Assert query with indigenous communities filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => true,
          'isWoman' => false,
          'isVisibleMinority' => false,
          'hasDisability' => false
          ]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with isVisibleMinority filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => false,
          'isWoman' => false,
          'isVisibleMinority' => true,
          'hasDisability' => false
          ]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with hasDisability filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => false,
          'isWoman' => false,
          'isVisibleMinority' => false,
          'hasDisability' => true
          ]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with isWoman filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => false,
          'isWoman' => true,
          'isVisibleMinority' => false,
          'hasDisability' => false
          ]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with isWoman OR isIndigenous filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => true,
          'isWoman' => true,
          'isVisibleMinority' => false,
          'hasDisability' => false
          ]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);
    // Assert query with isWoman OR isIndigenous OR isMinority filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => true,
          'isWoman' => true,
          'isVisibleMinority' => true,
          'hasDisability' => false
          ]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 3
      ]
    ]);
    // Assert query above with empty selection in equity object will not break the code and matches the returned candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => true,
          'isWoman' => true,
          'isVisibleMinority' => true,
          ]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 3
      ]
    ]);
    // Assert query with all equity filters true will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => true,
          'isWoman' => true,
          'isVisibleMinority' => true,
          'hasDisability' => true
          ]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 4
      ]
    ]);
    // Assert query with all EmploymentEquity filters set to false will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => false,
          'isWoman' => false,
          'isVisibleMinority' => false,
          'hasDisability' => false
        ],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 9
      ]
    ]);
    // Assert query with all EmploymentEquity filters set to false will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => false,
          'isWoman' => false,
          'isVisibleMinority' => false,
          'hasDisability' => false
        ],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 9
      ]
    ]);
    // Assert query with all EmploymentEquity filters set to null or not present will return all candidates same as above
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'equity' => [
          'isIndigenous' => false,
          'isWoman' => null,
        ],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 9
      ]
    ]);
  }

  public function testFilterByLanguageAbility(): void
  {

    // Create initial data.
    PoolCandidate::factory()->count(5)->create([
      'user_id' => User::factory([
        'looking_for_english' => false,
        'looking_for_french' => false,
        'looking_for_bilingual' => false,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Create new LanguageAbility and attach to 3 new pool candidates.
    PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'looking_for_english' => false,
        'looking_for_french' => true,
        'looking_for_bilingual' => false,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'looking_for_english' => true,
        'looking_for_french' => false,
        'looking_for_bilingual' => false,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'looking_for_english' => false,
        'looking_for_french' => false,
        'looking_for_bilingual' => true,
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Assert query with no LanguageAbility filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 8
      ]
    ]);

    // Assert query with LanguageAbility filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'languageAbility' => "ENGLISH",
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with LanguageAbility filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'languageAbility' => "FRENCH",
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with LanguageAbility filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'languageAbility' => "BILINGUAL",
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with a null LanguageAbility filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'languageAbility' => null,
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 8
      ]
    ]);
  }

  public function testFilterByLocationPreferences(): void
  {
    // Create 5 new pool candidates with a ONTARIO location preference.
    PoolCandidate::factory()->count(5)->create([
      'user_id' => User::factory([
        'location_preferences' => ["ONTARIO"],
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Create 2 new pool candidates with a TELEWORK location preference.
    PoolCandidate::factory()->count(2)->create([
      'user_id' => User::factory([
        'location_preferences' => ["TELEWORK"],
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Assert query with no WorkRegion filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);

    // Assert query with WorkRegion filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'locationPreferences' => ["TELEWORK"],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with empty WorkRegion filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'locationPreferences' => [],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);
  }

  public function testFilterByCandidateStatus(): void
  {
    $nonAvailableStatuses = array('PLACED_INDETERMINATE', 'PLACED_TERM', 'NO_LONGER_INTERESTED');
    // Create 3 pool candidates available status
    PoolCandidate::factory()->count(3)->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
      'expiry_date' => config('constants.far_future_date'),
    ]);

    // Create 6 pool candidates with non-available statuses
    PoolCandidate::factory()->count(6)->create([
      'pool_candidate_status' => $nonAvailableStatuses[array_rand($nonAvailableStatuses)],
      'expiry_date' => config('constants.far_future_date'),
    ]);

    // Assert query will return appropriate candidate count, only AVAILABLE due to scoped filter
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 3
      ]
    ]);

  }

  public function testFilterByClassificationToSalary(): void
  {
    // Create initial data.
    Classification::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create([
      'user_id' => User::factory([
        'expected_salary' => [],
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Create new classification.
    $classificationLvl1 = Classification::factory()->create([
      'group' => 'ZZ',
      'level' => 1,
      'min_salary' => 50000,
      'max_salary' => 69000,
    ]);

    // Attach new candidates that are in the expected salary range.
    $poolCandidate1 = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => ['_50_59K', '_70_79K'],
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate1->user->expectedClassifications()->delete();
    $poolCandidate1->user->expectedClassifications()->save($classificationLvl1);

    // Attach new candidates that overlap the expected salary range.
    $poolCandidate2 = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => ['_60_69K', '_80_89K'],
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate2->user->expectedClassifications()->delete();

    // Attach new candidates that are over the expected salary range.
    $poolCandidate3 = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => ['_90_99K', '_100K_PLUS'],
      ]),
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate3->user->expectedClassifications()->delete();

    // Assert query with no classifications filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 8
      ]
    ]);

    // Assert query with classification filter will return candidates in range and overlapping.
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'expectedClassifications' => [['group' => 'ZZ', 'level' => 1 ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown classification filter will return zero
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByClassificationToSalaryWithPools(): void
  {
    // myPool will be people we're querying for and should be returned
    $myPool = Pool::factory()->create(['name' => 'myPool']);
    // Pool 1 will be people we're not querying for and should not be returned
    $otherPool = Pool::factory()->create(['name' => 'otherPool']);

    // myClassification is the classification we will be querying for
    $myClassification = Classification::factory()->create([
      'group' => 'ZZ',
      'level' => 1,
      'min_salary' => 55000,
      'max_salary' => 64999,
    ]);

    // *** first make three candidates in the right pool - 1 has an exact classification match, 1 has a salary to classification match, 1 has no match

    // Attach new candidate in the pool with the desired classification
    $poolCandidate1 = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => [],
      ]),
      'pool_id' => $myPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate1->user->expectedClassifications()->delete();
    $poolCandidate1->user->expectedClassifications()->save($myClassification);

    // Attach new candidate in the pool that overlaps the expected salary range and has a matching class group (but not level).
    $poolCandidate2 = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => ['_60_69K'],
      ]),
      'pool_id' => $myPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate2->user->expectedClassifications()->delete();

    // Attach new candidate in the pool that is over the expected salary range and has a matching class group (but not level).
    $poolCandidate3 = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => ['_90_99K', '_100K_PLUS'],
      ]),
      'pool_id' => $myPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate3->user->expectedClassifications()->delete();

    // *** now make the same three candidates in the wrong pool

    // Attach new candidate in the pool with the desired classification WRONG POOL
    $poolCandidate1WrongPool = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => [],
      ]),
      'pool_id' => $otherPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate1WrongPool->user->expectedClassifications()->delete();
    $poolCandidate1WrongPool->user->expectedClassifications()->save($myClassification);

    // Attach new candidate in the pool that overlaps the expected salary range. WRONG POOL
    $poolCandidate2WrongPool = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => ['_60_69K'],
      ]),
      'pool_id' => $otherPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate2WrongPool->user->expectedClassifications()->delete();

    // Attach new candidate in the pool that is over the expected salary range.  WRONG POOL
    $poolCandidate3WrongPool = PoolCandidate::factory()->create([
      'user_id' => User::factory([
        'expected_salary' => ['_90_99K', '_100K_PLUS'],
      ]),
      'pool_id' => $otherPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $poolCandidate3WrongPool->user->expectedClassifications()->delete();

    // Assert query with just pool filters will return all candidates in that pool
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'pools' => [['id' => $myPool->id ]]
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 3
      ]
    ]);

    // Assert query with classification filter will return candidates in range and overlapping in that pool
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'pools' => [['id' => $myPool->id ]],
        'expectedClassifications' => [['group' => 'ZZ', 'level' => 1 ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown classification filter will return zero
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'pools' => [['id' => $myPool->id ]],
        'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByExpiryDate(): void
  {
    // Create admin user we run tests as
    $newUser = new User;
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->roles = ['ADMIN'];
    $newUser->save();

    // Create some expired users
    $expiredCandidates = PoolCandidate::factory()->count(2)
    ->state(new Sequence(
      ['id' => UuidHelpers::integerToUuid(1)],
      ['id' => UuidHelpers::integerToUuid(2)],
    ))
    ->create([
      'expiry_date' => '2000-05-13',
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);

    // Create some valid users
    $futureCandidates = PoolCandidate::factory()->count(4)
    ->state(new Sequence(
      ['id' => UuidHelpers::integerToUuid(3)],
      ['id' => UuidHelpers::integerToUuid(4)],
      ['id' => UuidHelpers::integerToUuid(5)],
      ['id' => UuidHelpers::integerToUuid(6)],
    ))
    ->create([
      'expiry_date' => '3000-05-13',
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $todayCandidate = PoolCandidate::factory()->create([
      'id' => UuidHelpers::integerToUuid(7),
      'expiry_date' => date("Y-m-d"),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $futureCandidates->concat($todayCandidate);
    $nullCandidates = PoolCandidate::factory()->count(3)
    ->state(new Sequence(
      ['id' => UuidHelpers::integerToUuid(8)],
      ['id' => UuidHelpers::integerToUuid(9)],
      ['id' => UuidHelpers::integerToUuid(10)],
    ))
    ->create([
      'expiry_date' => null,
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
    ]);
    $futureCandidates->concat($nullCandidates);

    $allCandidates = $expiredCandidates;
    $allCandidates->concat($futureCandidates);

    // Assert countPoolCandidates query ignores expired candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates {
        countPoolCandidates
      }
    ')->assertJson([
      'data' => [
        'countPoolCandidates' => 8
      ]
    ]);

    // Assert searchPoolCandidates query with no parameters returns correct candidates
    $this->graphQL(/** @lang Graphql */ '
      query searchPoolCandidates($orderBy: [OrderByClause!]) {
        searchPoolCandidates(orderBy: $orderBy) {
          id
        }
      }
    ', [
      'orderBy' => [
          [
          'column' => 'id',
          'order' => 'ASC'
          ]
      ]
    ])->assertJson([
      'data' => [
        'searchPoolCandidates' => $futureCandidates->map->only(['id'])->toArray()
      ]
    ]);

    // Assert searchPoolCandidates query with expiryStatus ACTIVE returns correct candidates
    $this->graphQL(/** @lang Graphql */ '
      query searchPoolCandidates($orderBy: [OrderByClause!], $expiryStatus: CandidateExpiryFilter) {
        searchPoolCandidates(orderBy: $orderBy, expiryStatus: $expiryStatus) {
          id
        }
      }
    ', [
      'orderBy' => [
          [
            'column' => 'id',
            'order' => 'ASC'
          ]
      ],
      'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE
    ])->assertJson([
      'data' => [
        'searchPoolCandidates' => $futureCandidates->map->only(['id'])->toArray()
      ]
    ]);

    // Assert searchPoolCandidates query with expiryStatus EXPIRED returns correct candidates
    $this->graphQL(/** @lang Graphql */ '
      query searchPoolCandidates($orderBy: [OrderByClause!], $expiryStatus: CandidateExpiryFilter) {
        searchPoolCandidates(orderBy: $orderBy, expiryStatus: $expiryStatus) {
          id
        }
      }
    ', [
      'orderBy' => [
          [
          'column' => 'id',
          'order' => 'ASC'
          ]
      ],
      'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_EXPIRED
    ])->assertJson([
      'data' => [
        'searchPoolCandidates' => $expiredCandidates->map->only(['id'])->toArray()
      ]
    ]);

    // Assert searchPoolCandidates query with expiryStatus ALL returns correct candidates
    $this->graphQL(/** @lang Graphql */ '
      query searchPoolCandidates($orderBy: [OrderByClause!], $expiryStatus: CandidateExpiryFilter) {
        searchPoolCandidates(orderBy: $orderBy, expiryStatus: $expiryStatus) {
          id
        }
      }
    ', [
      'orderBy' => [
          [
          'column' => 'id',
          'order' => 'ASC'
          ]
      ],
      'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ALL
    ])->assertJson([
      'data' => [
        'searchPoolCandidates' => $expiredCandidates->map->only(['id'])->toArray()
      ]
    ]);
  }

  public function testPoolCandidateStatusAccessor(): void
  {
    // Create admin user we run tests as
    $newUser = new User;
    $newUser->email = 'admin@test.com';
    $newUser->sub = 'admin@test.com';
    $newUser->roles = ['ADMIN'];
    $newUser->save();

    // 1
    // not submitted, expiry date in the future DRAFT
    $candidateOne = PoolCandidate::factory()->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
      'submitted_at' => null,
      'expiry_date' => config('constants.far_future_date'),
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    ]);
    // set status to EXPIRED manually despite not being submitted
    // this was split into two steps as otherwise PoolCandidateFactory automatically assigns a submitted_at
    $candidateOne->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_EXPIRED;
    $candidateOne->save();

    // 2
    // not submitted, expiry date in the past, DRAFT EXPIRED
    $candidateTwo = PoolCandidate::factory()->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
      'submitted_at' => null,
      'expiry_date' => config('constants.past_date'),
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    ]);
    // set status to EXPIRED manually despite not being submitted
    $candidateTwo->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_EXPIRED;
    $candidateTwo->save();

    // 3
    // expired and submitted applicant that has a PLACED status
    $candidateThree = PoolCandidate::factory()->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
      'submitted_at' => config('constants.past_date'),
      'expiry_date' => config('constants.past_date'),
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    ]);

    // 4
    // expired and submitted applicant that lacks a PLACED status
    $candidateFour = PoolCandidate::factory()->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_UNDER_ASSESSMENT,
      'submitted_at' => config('constants.past_date'),
      'expiry_date' => config('constants.past_date'),
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    ]);

    // 5
    // unexpired and submitted
    $candidateFive = PoolCandidate::factory()->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
      'submitted_at' => config('constants.past_date'),
      'expiry_date' => config('constants.far_future_date'),
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    ]);

    // 6
    // unexpired and submitted
    $candidateSix = PoolCandidate::factory()->create([
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
      'submitted_at' => config('constants.past_date'),
      'expiry_date' => config('constants.far_future_date'),
      'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    ]);

    // Assert candidate 1 is DRAFT, despite being set as EXPIRED, the null submitted_at forces an override
    // $this->graphQL(/** @lang Graphql */ '
    //   query poolCandidate($id: ID!) {
    //       poolCandidate(id: $id) {
    //           status
    //       }
    //   }
    //   ', [
    //     'id' => $candidateOne->id,
    //     ])->assertJson([
    //    "data" => [
    //       "poolCandidate" => [
    //           "status" => ApiEnums::CANDIDATE_STATUS_DRAFT,
    //       ]
    //   ]
    // ]);

    // Assert candidate 2 is DRAFT_EXPIRED, despite being set as EXPIRED, the null submitted_at forces an override
    // $this->graphQL(/** @lang Graphql */ '
    //   query poolCandidate($id: ID!) {
    //       poolCandidate(id: $id) {
    //           status
    //       }
    //   }
    //   ', [
    //     'id' => $candidateTwo->id,
    //     ])->assertJson([
    //    "data" => [
    //       "poolCandidate" => [
    //           "status" => ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
    //       ]
    //   ]
    // ]);

    // Assert candidate 3 is PLACED_CASUAL, despite being past expiry date
    $this->graphQL(/** @lang Graphql */ '
      query poolCandidate($id: UUID!) {
          poolCandidate(id: $id) {
              status
          }
      }
      ', [
        'id' => $candidateThree->id,
        ])->assertJson([
       "data" => [
          "poolCandidate" => [
              "status" => ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
          ]
      ]
    ]);

    // Assert candidate 4 is EXPIRED, despite being set as UNDER_ASSESSMENT an override occurs due to being past expiry
    // $this->graphQL(/** @lang Graphql */ '
    //   query poolCandidate($id: ID!) {
    //       poolCandidate(id: $id) {
    //           status
    //       }
    //   }
    //   ', [
    //     'id' => $candidateFour->id,
    //     ])->assertJson([
    //    "data" => [
    //       "poolCandidate" => [
    //           "status" => ApiEnums::CANDIDATE_STATUS_EXPIRED,
    //       ]
    //   ]
    // ]);

    // Assert candidate 5 is NEW_APPLICATION as it was set
    $this->graphQL(/** @lang Graphql */ '
      query poolCandidate($id: UUID!) {
          poolCandidate(id: $id) {
              status
          }
      }
      ', [
        'id' => $candidateFive->id,
        ])->assertJson([
       "data" => [
          "poolCandidate" => [
              "status" => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
          ]
      ]
    ]);

    // Assert candidate 6 is APPLICATION_REVIEW as it was set
    $this->graphQL(/** @lang Graphql */ '
      query poolCandidate($id: UUID!) {
          poolCandidate(id: $id) {
              status
          }
      }
      ', [
        'id' => $candidateSix->id,
        ])->assertJson([
       "data" => [
          "poolCandidate" => [
              "status" => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
          ]
      ]
    ]);
  }

  public function testAllStatuses(): void
  {
    // Create initial data.
    foreach(ApiEnums::candidateStatuses() as $candidateStatus) {
      PoolCandidate::factory()->create([
        'expiry_date' => config('constants.far_future_date'), // ensure no candidates are expired for this test
        'pool_candidate_status' => $candidateStatus,
      ]);
    }

    // Assert query with no explicit filter will return only 2 candidates: Placed - Casual and Qualified - Available
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);
  }
}
