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

    // Create initial data.
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

    // Assert query with no classifications filter will return all candidates
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

    // Assert query with unknown classification filter will return zero
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

    // Create initial data.
    CmoAsset::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create();

    // Create new cmoAsset and attach to two new pool candidates.
    $cmoAsset = CmoAsset::factory()->create([
      'key' => 'new_cmo_asset'
    ]);
    PoolCandidate::factory()->count(2)->create()->each(function($candidate) use ($cmoAsset) {
      $candidate->cmoAssets()->save($cmoAsset);
    });

    // Assert query with no cmoAssets filter will return all candidates
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

    // Assert query with unknown cmoAsset filter will return zero
    $this->graphQL(/** @lang Graphql */ '
      query countPoolCandidates($where: PoolCandidateFilterInput) {
        countPoolCandidates(where: $where)
      }
    ', [
      'where' => [
        'cmoAssets' => [[ 'key' => 'unknown_cmo_asset' ]],
      ]
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByOperationalRequirements(): void
  {

    // Create initial data.
    OperationalRequirement::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create();

    // Create new operationalRequirement and attach to two new pool candidates.
    $operationalRequirement = OperationalRequirement::factory()->create([
      'key' => 'new_operational_requirement'
    ]);
    PoolCandidate::factory()->count(2)->create()->each(function($candidate) use ($operationalRequirement) {
      $candidate->acceptedOperationalRequirements()->save($operationalRequirement);
    });

    // Assert query with no operationalRequirements filter will return all candidates
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

    // Assert query with unknown operationalRequirement filter will return zero
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

    // Create initial data.
    Pool::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create();

    // Create new pool and attach to two new pool candidates.
    $pool = Pool::factory()->create();
    PoolCandidate::factory()->count(2)->create()->each(function($candidate) use ($pool) {
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
    ])->seeJson([
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
    ])->seeJson([
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
    ])->seeJson([
      'data' => [
        'countPoolCandidates' => 0
      ]
    ]);
  }

  public function testFilterByDiploma(): void
  {

    // Create initial set of 5 candidates with no diploma.
    PoolCandidate::factory()->count(5)->create([
      'has_diploma' => false,
    ]);

    // Create two new pool candidates with a diploma.
    PoolCandidate::factory()->count(2)->create([
      'has_diploma' => true,
    ]);

    // Assert query no hasDiploma filter will return all candidates
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

    // Assert query with hasDiploma filter set to true will return correct candidate count
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

    // Assert query with hasDiploma filter set to false will return all candidates
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

    // Create initial data.
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

    // Assert query with no EmploymentEquity filter will return all candidates
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

    // Assert query with isIndigenous filter will return correct candidate count
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
    // Assert query with isVisibleMinority filter will return correct candidate count
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
    // Assert query with hasDisability filter will return correct candidate count
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
    // Assert query with isWoman filter will return correct candidate count
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

    // Create initial data.
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

    // Assert query with no LanguageAbility filter will return all candidates
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
    // Assert query with a unknown LanguageAbility filter will return no candidates
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
    // Create 5 new pool candidates with a ONTARIO location preference.
    PoolCandidate::factory()->count(5)->create([
      'location_preferences' => ["ONTARIO"],
    ]);

    // Create 2 new pool candidates with a TELEWORK location preference.
    PoolCandidate::factory()->count(2)->create([
      'location_preferences' => ["TELEWORK"],
    ]);

    // Assert query with no WorkRegion filter will return all candidates
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

    // Assert query with empty WorkRegion filter will return all candidates
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

  public function testFilterByClassificationToSalary(): void
  {
    // Create initial data.
    Classification::factory()->count(3)->create();
    PoolCandidate::factory()->count(5)->create();

    // Create new classification.
    $classificationLvl1 = Classification::factory()->create([
      'group' => 'ZZ',
      'level' => 1,
      'min_salary' => 50000,
      'max_salary' => 69000,
    ]);
    $classificationLvl2 = Classification::factory()->create([
      'group' => 'ZZ',
      'level' => 2,
      'min_salary' => 70000,
      'max_salary' => 89000,
    ]);
    $classificationLvl3 = Classification::factory()->create([
      'group' => 'ZZ',
      'level' => 3,
      'min_salary' => 90000,
      'max_salary' => 100000,
    ]);

    // Attach new candidates that are in the expected salary range.
    $poolCandidate1 = PoolCandidate::factory()->create([
      'expected_salary' => ['_50_59K', '_70_79K']
    ]);
    $poolCandidate1->expectedClassifications()->delete();
    $poolCandidate1->expectedClassifications()->save($classificationLvl1);

    // Attach new candidates that overlap the expected salary range.
    $poolCandidate2 = PoolCandidate::factory()->create([
      'expected_salary' => ['_60_69K', '_80_89K']
    ]);
    $poolCandidate2->expectedClassifications()->delete();
    $poolCandidate2->expectedClassifications()->save($classificationLvl2);

    // Attach new candidates that are over the expected salary range.
    $poolCandidate3 = PoolCandidate::factory()->create([
      'expected_salary' => ['_90_99K', '_100K_PLUS']
    ]);
    $poolCandidate3->expectedClassifications()->delete();
    $poolCandidate3->expectedClassifications()->save($classificationLvl3);


    // Assert query with no classifications filter will return all candidates
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

    // Assert query with classification filter will return candidates in range and overlapping.
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

    // Assert query with unknown classification filter will return zero
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
}

