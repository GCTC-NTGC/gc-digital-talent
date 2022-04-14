<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

/**
 * Class PoolCandidate
 *
 * @property int $id
 * @property string $cmo_identifier
 * @property Illuminate\Support\Carbon $expiry_date
 * @property boolean $is_woman
 * @property boolean $has_disability
 * @property boolean $is_indigenous
 * @property boolean $is_visible_minority
 * @property boolean $has_diploma
 * @property string $language_ability
 * @property array $location_preferences
 * @property array $expected_salary
 * @property string $pool_candidate_status
 * @property int $pool_id
 * @property int $user_id
 * @property array $accepted_operational_requirements
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class PoolCandidate extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */

    protected $casts = [
        'expiry_date' => 'date',
        'location_preferences' => 'array',
        'expected_salary' => 'array',
        'accepted_operational_requirements' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }
    public function expectedClassifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'classification_pool_candidate');
    }
    public function cmoAssets(): BelongsToMany
    {
        return $this->belongsToMany(CmoAsset::class);
    }


    public function filterByClassifications(Builder $query, array $classifications): Builder
    {
        // Classifications act as an OR filter. The query should return candidates with any of the classifications.
        // A single whereHas clause for the relationship, containing multiple orWhere clauses accomplishes this.
        $query->whereHas('expectedClassifications', function ($query) use ($classifications) {
            foreach ($classifications as $index => $classification) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere
                    $query->where(function($query) use ($classification) {
                        $query->where('group', $classification['group'])->where('level', $classification['level']);
                    });
                } else {
                    $query->orWhere(function($query) use ($classification) {
                        $query->where('group', $classification['group'])->where('level', $classification['level']);
                    });
                }
            }
        });

        $this->orFilterByClassificationToSalary($query, $classifications);

        return $query;
    }

    private function orFilterByClassificationToSalary(Builder $query, array $classifications): Builder
    {
        // When managers search for a classification, also return any users whose expected salary
        // ranges overlap with the min/max salaries of any of those classifications.
        // Since salary ranges are text enums a custom SQL subquery is used to convert them to
        // numeric values and compare them to specified classifications

        // This subquery only works for a non-zero number of filter classifications.
        // If passed zero classifications then return same query builder unchanged.
        if(count($classifications) == 0)
            return $query;

        $parameters = [];
        $sql = <<<RAWSQL1

SELECT NULL    -- find all candidates where a salary/group combination matches a classification filter
  FROM (
    SELECT    -- convert salary ranges to numeric min/max values
      t.candidate_id,
      CASE t.salary_range_id
        WHEN '_50_59K' THEN 50000
        WHEN '_60_69K' THEN 60000
        WHEN '_70_79K' THEN 70000
        WHEN '_80_89K' THEN 80000
        WHEN '_90_99K' THEN 90000
        WHEN '_100K_PLUS' THEN 100000
      END min_salary,
      CASE t.salary_range_id
        WHEN '_50_59K' THEN 59999
        WHEN '_60_69K' THEN 69999
        WHEN '_70_79K' THEN 79999
        WHEN '_80_89K' THEN 89999
        WHEN '_90_99K' THEN 99999
        WHEN '_100K_PLUS' THEN 2147483647
      END max_salary,
      t.classification_group
    FROM (
      SELECT    -- find all combinations of salary range and classification group for each candidate
        pc.id candidate_id,
        JSONB_ARRAY_ELEMENTS_TEXT(pc.expected_salary) salary_range_id,
        c.group classification_group
      FROM pool_candidates pc
      JOIN classification_pool_candidate cpc ON pc.id = cpc.pool_candidate_id
      JOIN classifications c ON cpc.classification_id = c.id
    ) t
  ) u
  JOIN classifications c ON
    c.max_salary >= u.min_salary
    AND c.min_salary <= u.max_salary
    AND c.group = u.classification_group
  WHERE (

RAWSQL1;

        foreach ($classifications as $index => $classification) {
            if ($index === 0) {
                // First iteration must use where instead of orWhere
                $sql .= '(c.group = ? AND c.level = ?)';
            } else {
                $sql .= ' OR (c.group = ? AND c.level = ?)';
            }
            array_push($parameters, [$classification['group'], $classification['level']]);
        }

        $sql .= <<<RAWSQL2
  )
  AND u.candidate_id = "pool_candidates".id

RAWSQL2;

        return $query->orWhereRaw('EXISTS (' . $sql . ')', $parameters);
    }

    public function filterByCmoAssets(Builder $query, array $cmoAssets): Builder
    {
        // CmoAssets act as an AND filter. The query should only return candidates with ALL of the assets.
        // This is accomplished with multiple whereHas clauses for the cmoAssets relationship.
        foreach ($cmoAssets as $cmoAsset) {
            $query->whereHas('cmoAssets', function ($query) use ($cmoAsset) {
                $query->where('key', $cmoAsset['key']);
            });
        }
        return $query;
    }
    public function filterByOperationalRequirements(Builder $query, ?array $operationalRequirements): Builder
    {
        // OperationalRequirements act as an AND filter. The query should only return candidates willing to accept ALL of the requirements.
            $query->whereJsonContains('accepted_operational_requirements', $operationalRequirements);
        return $query;
    }
    public function filterByWorkRegions(Builder $query, array $workRegions): Builder
    {
        // WorkRegion acts as an OR filter. The query should return candidates willing to work in ANY of the regions.
        $query->where(function($query) use ($workRegions) {
            foreach($workRegions as $index => $region) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere
                    $query->whereJsonContains('location_preferences', $region);
                } else {
                    $query->orWhereJsonContains('location_preferences', $region);
                }
            }
        });
        return $query;
    }
    public function filterByLanguageAbility(Builder $query, ?string $languageAbility): Builder
    {
        // If filtering for a specific language the query should return candidates of that language OR bilingual.
        $query->where(function($query) use ($languageAbility) {
            // Is there any way of getting these from the graphql enum?
            $englishEnumOption = "ENGLISH";
            $frenchEnumOption = "FRENCH";
            $bilingualEnumOption = "BILINGUAL";

            if ($languageAbility == $englishEnumOption || $languageAbility == $frenchEnumOption) {
                $query->where('language_ability', $languageAbility);
                $query->orWhere('language_ability', $bilingualEnumOption);
            }
        });
        return $query;
    }
    public function filterByPools(Builder $query, array $pools): Builder
    {
        if (empty($pools)) {
            return $query;
        }

        // Pool acts as an OR filter. The query should return candidates in ANY of the pools.
        $poolIds = [];
        foreach ($pools as $pool) {
            array_push($poolIds, $pool['id']);
        }
        $query->whereIn('pool_id', $poolIds);
        return $query;
    }

    public function scopeHasDiploma(Builder $query, bool $hasDiploma): Builder
    {
        if ($hasDiploma) {
            $query->where('has_diploma', true);
        }
        return $query;
    }
    public function scopeHasDisability(Builder $query, bool $hasDisability): Builder
    {
        if ($hasDisability) {
            $query->where('has_disability', true);
        }
        return $query;
    }
    public function scopeIsIndigenous(Builder $query, bool $isIndigenous): Builder
    {
        if ($isIndigenous) {
            $query->where('is_indigenous', true);
        }
        return $query;
    }
    public function scopeIsVisibleMinority(Builder $query, bool $isVisibleMinority): Builder
    {
        if ($isVisibleMinority) {
            $query->where('is_visible_minority', true);
        }
        return $query;
    }
    public function scopeIsWoman(Builder $query, bool $isWoman): Builder
    {
        if ($isWoman) {
            $query->where('is_woman', true);
        }
        return $query;
    }


}
