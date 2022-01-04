<?php

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\OperationalRequirement;
use App\Models\Pool;
use App\Models\PoolCandidate;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequestsLumen;

class PoolCandidateTest extends TestCase
{
  use DatabaseMigrations;
  use MakesGraphQLRequestsLumen;
  use ClearsSchemaCache;

  protected function setUp(): void
  {
    parent::setUp();
    $this->bootClearsSchemaCache();
  }

  public function testFilterByClassification(): void
  {

    // Create 5 pool candidates.
    Classification::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create();

    // Create new classification and attach to two new pool candidates.
    $classification = Classification::factory()->create([
      'group' => 'ZZ',
      'level' => 1,
    ]);
    PoolCandidate::factory()->count(2)->create()->each(function($candidate) use ($classification) {
      $candidate->expectedClassifications()->save($classification);
    });

    // Assert query will with no classifications filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->seeJson([
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
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown classification filter will return 0
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'classifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByCmoAsset(): void
  {

    // Create 5 pool candidates.
    CmoAsset::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create();

    // Create new cmoAsset and attach to 2 new pool candidates.
    $cmoAsset = CmoAsset::factory()->create([
      'key' => 'new_cmo_asset'
    ]);
    PoolCandidate::factory()->count(2)->create()->each(function($candidate) use ($cmoAsset) {
      $candidate->cmoAssets()->save($cmoAsset);
    });

    // Assert query will with no cmoAssets filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->seeJson([
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
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown cmoAsset filter will return 0
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'cmoAssets' => [[ 'key' => 'unknown_id' ]],
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByOperationalRequirements(): void
  {

    // Create 5 pool candidates.
    OperationalRequirement::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create();

    // Create new operationalRequirement and attach to 2 new pool candidates.
    $operationalRequirement = OperationalRequirement::factory()->create([
      'key' => 'new_operational_requirement'
    ]);
    PoolCandidate::factory()->count(2)->create()->each(function($candidate) use ($operationalRequirement) {
      $candidate->acceptedOperationalRequirements()->save($operationalRequirement);
    });

    // Assert query will with no operationalRequirements filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);

    // Assert query with operationalRequirement filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'operationalRequirements' => [[ 'key' => 'new_operational_requirement' ]],
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown operationalRequirement filter will return 0
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'operationalRequirements' => [[ 'key' => 'unknown_operational_requirement' ]],
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByPool(): void
  {

    // Create 5 pool candidates.
    Pool::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create();

    // Create new cmoAsset and attach to 2 new pool candidates.
    $pool = Pool::factory()->create();
    PoolCandidate::factory()->count(2)->create()->each(function($candidate) use ($pool) {
      $candidate->pool()->associate($pool);
      $candidate->save();
    });

    // Assert query will with no cmoAssets filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->seeJson([
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
        'pools' => [[ 'id' => $pool['id'] ]],
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with unknown cmoAsset filter will return 0
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'pools' => [[ 'id' => '00000000-0000-0000-0000-000000000000' ]],
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByDiploma(): void
  {

    // Create 5 pool candidates.
    PoolCandidate::factory()->count(5)->create([
      'has_diploma' => false,
    ]);

    // Create new operationalRequirement and attach to 2 new pool candidates.
    PoolCandidate::factory()->count(2)->create([
      'has_diploma' => true,
    ]);

    // Assert query will with no operationalRequirements filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);

    // Assert query with operationalRequirement filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'hasDiploma' => true,
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with filter set to false will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'hasDiploma' => false,
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);
  }

  public function testFilterByEmploymentEquity(): void
  {

    // Create 5 pool candidates.
    PoolCandidate::factory()->count(5)->create([
      'has_disability' => false,
      'is_indigenous' => false,
      'is_visible_minority' => false,
      'is_woman' => false,
    ]);

    // Create one new candidate for each EmploymentEquity filter
    PoolCandidate::factory()->create([
      'has_disability' => true,
      'is_indigenous' => false,
      'is_visible_minority' => false,
      'is_woman' => false,
    ]);
    PoolCandidate::factory()->create([
      'has_disability' => false,
      'is_indigenous' => true,
      'is_visible_minority' => false,
      'is_woman' => false,
    ]);
    PoolCandidate::factory()->create([
      'has_disability' => false,
      'is_indigenous' => false,
      'is_visible_minority' => true,
      'is_woman' => false,
    ]);
    PoolCandidate::factory()->create([
      'has_disability' => false,
      'is_indigenous' => false,
      'is_visible_minority' => false,
      'is_woman' => true,
    ]);

    // Assert query will with no EmploymentEquity filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 9
      ]
    ]);

    // Assert query with EmploymentEquity filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'isIndigenous' => true,
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with EmploymentEquity filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'isVisibleMinority' => true,
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with EmploymentEquity filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'hasDisability' => true,
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with EmploymentEquity filter will return correct candidate count
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'isWoman' => true,
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);

    // Assert query with all EmploymentEquity filters set to false will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'hasDisability' => false,
        'isIndigenous' => false,
        'isVisibleMinority' => false,
        'isWoman' => false,
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 9
      ]
    ]);
  }

  public function testFilterByLanguageAbility(): void
  {

    // Create 5 pool candidates.
    PoolCandidate::factory()->count(5)->create([
      'language_ability' => 'TEST'
    ]);

    // Create new LanguageAbility and attach to 3 new pool candidates.
    PoolCandidate::factory()->create([
      'language_ability' => 'FRENCH'
    ]);
    PoolCandidate::factory()->create([
      'language_ability' => 'ENGLISH'
    ]);
    PoolCandidate::factory()->create([
      'language_ability' => 'BILINGUAL'
    ]);

    // Assert query will with no LanguageAbility filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->seeJson([
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
    ])->seeJson([
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
    ])->seeJson([
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
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 1
      ]
    ]);
    // Assert query with a null LanguageAbility filter will return no candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'languageAbility' => null,
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByWorkRegions(): void
  {
    // Create 5 new pool candidates for ONTARIO.
    PoolCandidate::factory()->count(5)->create([
      'location_preferences' => ["ONTARIO"],
    ]);

    // Create 2 new pool candidates for TELEWORK.
    PoolCandidate::factory()->count(2)->create([
      'location_preferences' => ["TELEWORK"],
    ]);

    // Assert query will with no WorkRegion filter will return all candidates
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => []
    ])->seeJson([
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
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 2
      ]
    ]);

    // Assert query with empty WorkRegion filter will return 0
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'workRegions' => [],
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 7
      ]
    ]);
  }
}

