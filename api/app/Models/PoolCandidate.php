<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
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
        // if no filters provided then return query unchanged
        if (empty($classifications)) {
            return $query;
        }

        // Classifications act as an OR filter. The query should return candidates with any of the classifications.
        // A single whereHas clause for the relationship, containing multiple orWhere clauses accomplishes this.

        // group these in a subquery to properly handle "OR" condition
        $query->where(function($query) use ($classifications) {
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
        });

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
      END max_salary
    FROM (
      SELECT    -- find all salary ranges for each candidate
        pc.id candidate_id,
        JSONB_ARRAY_ELEMENTS_TEXT(pc.expected_salary) salary_range_id
      FROM pool_candidates pc
    ) t
  ) u
  JOIN classifications c ON
    c.max_salary >= u.min_salary
    AND c.min_salary <= u.max_salary
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
        // if no filters provided then return query unchanged
        if (empty($operationalRequirements)) {
            return $query;
        }

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
            $query->where('language_ability', $languageAbility);
            if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_ENGLISH || $languageAbility == ApiEnums::LANGUAGE_ABILITY_FRENCH) {
                $query->orWhere('language_ability', ApiEnums::LANGUAGE_ABILITY_BILINGUAL);
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

    public function filterByEquity(Builder $query, array $equity): Builder
    {
        if (empty($equity)) {
            return $query;
        }

        // OR filter - first find out how many booleans are true, create array of all true equity bools
        // equity object has 4 keys with associated bools
        $equityVars = [];
        if (array_key_exists("is_woman", $equity) && $equity["is_woman"]) {
            array_push($equityVars, "is_woman");
        };
        if (array_key_exists("has_disability", $equity) && $equity["has_disability"]) {
            array_push($equityVars, "has_disability");
        };
        if (array_key_exists("is_indigenous", $equity) && $equity["is_indigenous"]) {
            array_push($equityVars, "is_indigenous");
        };
        if (array_key_exists("is_visible_minority", $equity) && $equity["is_visible_minority"]) {
            array_push($equityVars, "is_visible_minority");
        };

        // then return queries depending on above array count, special query syntax needed for multiple ORs to ensure proper SQL query formed
        $query->where(function($query) use ($equityVars) {
            foreach($equityVars as $index => $equityInstance) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere, as seen in filterWorkRegions
                    $query->where($equityVars[$index], true);
                } else {
                    $query->orWhere($equityVars[$index], true);
                }
            }
        });
        return $query;
    }

    public function scopeHasDiploma(Builder $query, bool $hasDiploma): Builder
    {
        if ($hasDiploma) {
            $query->where('has_diploma', true);
        }
        return $query;
    }

    public function scopeExpiryFilter(Builder $query, ?array $args) {
        $expiryStatus = isset($args['expiryStatus']) ? $args['expiryStatus'] : ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE;
        if ($expiryStatus == ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE) {
            $query->whereDate('expiry_date', '>=', date("Y-m-d"))
                  ->orWhereNull('expiry_date');
        } else if ($expiryStatus == ApiEnums::CANDIDATE_EXPIRY_FILTER_EXPIRED) {
            $query->whereDate('expiry_date', '<', date("Y-m-d"));
        }
        return $query;
    }
}
