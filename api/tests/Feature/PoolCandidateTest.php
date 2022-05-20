<?php

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\Pool;
use App\Models\PoolCandidate;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

class PoolCandidateTest extends TestCase
{
  use DatabaseMigrations;
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
    ]);
    $operationalRequirement1 = 'OVERTIME_SCHEDULED';
    $operationalRequirement2 = 'SHIFT_WORK';
    $operationalRequirement3 = 'ON_CALL';

    // Create a few with a op_req 1
    PoolCandidate::factory()->count(2)->create([
      'accepted_operational_requirements' => [$operationalRequirement1],
    ]);

    // Create a few with op_req 1 and 2
    PoolCandidate::factory()->count(2)->create([
      'accepted_operational_requirements' => [$operationalRequirement1, $operationalRequirement2],
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
        'isIndigenous' => true,
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
        'isVisibleMinority' => true,
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
        'hasDisability' => true,
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
        'isWoman' => true,
      ]
    ])->assertJson([
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

    // Attach new candidates that are over the expected salary range.
    $poolCandidate3 = PoolCandidate::factory()->create([
      'expected_salary' => ['_90_99K', '_100K_PLUS']
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
      'pool_id' => $myPool->id
    ]);
    $poolCandidate1->expectedClassifications()->delete();
    $poolCandidate1->expectedClassifications()->save($myClassification);

    // Attach new candidate in the pool that overlaps the expected salary range and has a matching class group (but not level).
    $poolCandidate2 = PoolCandidate::factory()->create([
      'expected_salary' => ['_60_69K'],
      'pool_id' => $myPool->id
    ]);
    $poolCandidate2->expectedClassifications()->delete();

    // Attach new candidate in the pool that is over the expected salary range and has a matching class group (but not level).
    $poolCandidate3 = PoolCandidate::factory()->create([
      'expected_salary' => ['_90_99K', '_100K_PLUS'],
      'pool_id' => $myPool->id
    ]);
    $poolCandidate3->expectedClassifications()->delete();

    // *** now make the same three candidates in the wrong pool

    // Attach new candidate in the pool with the desired classification WRONG POOL
    $poolCandidate1WrongPool = PoolCandidate::factory()->create([
      'expected_salary' => [],
      'pool_id' => $otherPool->id
    ]);
    $poolCandidate1WrongPool->expectedClassifications()->delete();
    $poolCandidate1WrongPool->expectedClassifications()->save($myClassification);

    // Attach new candidate in the pool that overlaps the expected salary range. WRONG POOL
    $poolCandidate2WrongPool = PoolCandidate::factory()->create([
      'expected_salary' => ['_60_69K'],
      'pool_id' => $otherPool->id
    ]);
    $poolCandidate2WrongPool->expectedClassifications()->delete();

    // Attach new candidate in the pool that is over the expected salary range.  WRONG POOL
    $poolCandidate3WrongPool = PoolCandidate::factory()->create([
      'expected_salary' => ['_90_99K', '_100K_PLUS'],
      'pool_id' => $otherPool->id
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
}

