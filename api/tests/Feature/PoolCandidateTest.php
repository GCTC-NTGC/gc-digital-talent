<?php

use App\Models\Classification;
use App\Models\CmoAsset;
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
      'expected_salary' => [], // remove salaries to avoid accidental classification-to-salary matching
      'expiry_date' => config('constants.far_future_date'), // ensure no candidates are expired for this test
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE, // ensure availability doesn't effect test
    ]);

    // Create new classification and attach to two new pool candidates.
    $classification = Classification::factory()->create([
      'group' => 'ZZ',
      'level' => 1,
    ]);
    PoolCandidate::factory()->count(2)->create([
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
      ])->each(function($candidate) use ($classification) {
      $candidate->expectedClassifications()->save($classification);
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
        'classifications' => [['group' => 'ZZ', 'level' => 1 ]],
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
        'classifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByCmoAsset(): void
  {

    // Create initial data.
    CmoAsset::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create(['expiry_date' => config('constants.far_future_date'), 'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,]);

    // Create new cmoAsset and attach to two new pool candidates.
    $cmoAsset = CmoAsset::factory()->create([
      'key' => 'new_cmo_asset'
    ]);
    PoolCandidate::factory()->count(2)->create(['expiry_date' => config('constants.far_future_date'), 'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,])->each(function($candidate) use ($cmoAsset) {

      $candidate->cmoAssets()->save($cmoAsset);
    });

    // Assert query with no cmoAssets filter will return all candidates
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

    // Assert query with cmoAsset filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'cmoAssets' => [[ 'key' => 'new_cmo_asset' ]],
      ]
    ])->assertJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown cmoAsset filter will return zero
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'cmoAssets' => [[ 'key' => 'unknown_cmo_asset' ]],
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
      'accepted_operational_requirements' => null,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE, // ensure no candidates are expired for this test
    ]);
    $operationalRequirement1 = 'OVERTIME_SCHEDULED';
    $operationalRequirement2 = 'SHIFT_WORK';
    $operationalRequirement3 = 'ON_CALL';

    // Create a few with a op_req 1
    PoolCandidate::factory()->count(2)->create([
      'accepted_operational_requirements' => [$operationalRequirement1],
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);

    // Create a few with op_req 1 and 2
    PoolCandidate::factory()->count(2)->create([
      'accepted_operational_requirements' => [$operationalRequirement1, $operationalRequirement2],
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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
    PoolCandidate::factory()->count(5)->create(['expiry_date' => config('constants.far_future_date'), 'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,]);

    // Create new pool and attach to two new pool candidates.
    $pool = Pool::factory()->create();
    PoolCandidate::factory()->count(2)->create(['expiry_date' => config('constants.far_future_date'), 'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,])->each(function($candidate) use ($pool) {
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
      'expiry_date' => config('constants.far_future_date'),
      'has_diploma' => false,
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);

    // Create two new pool candidates with a diploma.
    PoolCandidate::factory()->count(2)->create([
      'has_diploma' => true,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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
      'has_disability' => false,
      'is_indigenous' => false,
      'is_visible_minority' => false,
      'is_woman' => false,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);

    // Create one new candidate for each EmploymentEquity filter
    PoolCandidate::factory()->create([
      'has_disability' => true,
      'is_indigenous' => false,
      'is_visible_minority' => false,
      'is_woman' => false,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'has_disability' => false,
      'is_indigenous' => true,
      'is_visible_minority' => false,
      'is_woman' => false,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'has_disability' => false,
      'is_indigenous' => false,
      'is_visible_minority' => true,
      'is_woman' => false,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'has_disability' => false,
      'is_indigenous' => false,
      'is_visible_minority' => false,
      'is_woman' => true,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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

    // Assert query with isIndigenous filter will return correct candidate count
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
          'isIndigenous' => null,
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
      'language_ability' => 'TEST',
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);

    // Create new LanguageAbility and attach to 3 new pool candidates.
    PoolCandidate::factory()->create([
      'language_ability' => 'FRENCH',
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'language_ability' => 'ENGLISH',
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    PoolCandidate::factory()->create([
      'language_ability' => 'BILINGUAL',
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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
        'countPoolCandidates' => 2
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
        'countPoolCandidates' => 2
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
    // Assert query with a unknown LanguageAbility filter will return no candidates
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
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByWorkRegions(): void
  {
    // Create 5 new pool candidates with a ONTARIO location preference.
    PoolCandidate::factory()->count(5)->create([
      'location_preferences' => ["ONTARIO"],
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);

    // Create 2 new pool candidates with a TELEWORK location preference.
    PoolCandidate::factory()->count(2)->create([
      'location_preferences' => ["TELEWORK"],
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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
        'workRegions' => ["TELEWORK"],
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
        'workRegions' => [],
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
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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
      'expected_salary' => [],
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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
      'expected_salary' => ['_50_59K', '_70_79K'],
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate1->expectedClassifications()->delete();
    $poolCandidate1->expectedClassifications()->save($classificationLvl1);

    // Attach new candidates that overlap the expected salary range.
    $poolCandidate2 = PoolCandidate::factory()->create([
      'expected_salary' => ['_60_69K', '_80_89K'],
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate2->expectedClassifications()->delete();

    // Attach new candidates that are over the expected salary range.
    $poolCandidate3 = PoolCandidate::factory()->create([
      'expected_salary' => ['_90_99K', '_100K_PLUS'],
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate3->expectedClassifications()->delete();

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
        'classifications' => [['group' => 'ZZ', 'level' => 1 ]],
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
        'classifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
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
      'expected_salary' => [],
      'pool_id' => $myPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate1->expectedClassifications()->delete();
    $poolCandidate1->expectedClassifications()->save($myClassification);

    // Attach new candidate in the pool that overlaps the expected salary range and has a matching class group (but not level).
    $poolCandidate2 = PoolCandidate::factory()->create([
      'expected_salary' => ['_60_69K'],
      'pool_id' => $myPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate2->expectedClassifications()->delete();

    // Attach new candidate in the pool that is over the expected salary range and has a matching class group (but not level).
    $poolCandidate3 = PoolCandidate::factory()->create([
      'expected_salary' => ['_90_99K', '_100K_PLUS'],
      'pool_id' => $myPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate3->expectedClassifications()->delete();

    // *** now make the same three candidates in the wrong pool

    // Attach new candidate in the pool with the desired classification WRONG POOL
    $poolCandidate1WrongPool = PoolCandidate::factory()->create([
      'expected_salary' => [],
      'pool_id' => $otherPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate1WrongPool->expectedClassifications()->delete();
    $poolCandidate1WrongPool->expectedClassifications()->save($myClassification);

    // Attach new candidate in the pool that overlaps the expected salary range. WRONG POOL
    $poolCandidate2WrongPool = PoolCandidate::factory()->create([
      'expected_salary' => ['_60_69K'],
      'pool_id' => $otherPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate2WrongPool->expectedClassifications()->delete();

    // Attach new candidate in the pool that is over the expected salary range.  WRONG POOL
    $poolCandidate3WrongPool = PoolCandidate::factory()->create([
      'expected_salary' => ['_90_99K', '_100K_PLUS'],
      'pool_id' => $otherPool->id,
      'expiry_date' => config('constants.far_future_date'),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $poolCandidate3WrongPool->expectedClassifications()->delete();

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
        'classifications' => [['group' => 'ZZ', 'level' => 1 ]],
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
        'classifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
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
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
    ]);
    $todayCandidate = PoolCandidate::factory()->create([
      'id' => UuidHelpers::integerToUuid(7),
      'expiry_date' => date("Y-m-d"),
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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
      'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_AVAILABLE,
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

}

