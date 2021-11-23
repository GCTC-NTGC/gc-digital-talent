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
        'expected_salary' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }
    public function acceptedOperationalRequirements(): BelongsToMany
    {
        return $this->belongsToMany(OperationalRequirement::class, 'operational_requirement_pool_candidate');
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
        // TODO: Handle the mapping between classifications and salaries here

        // Classifications act as an OR filter. The query should return candidates with any of the classifications.
        // A single whereHas clause for the relationship, containing multiple orWhere clauses accomplishes this.
        return $query->whereHas('expectedClassifications', function ($query) use ($classifications) {
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
    public function filterByOperationalRequirements(Builder $query, array $operationalRequirements): Builder
    {
        // OperationalRequirements act as an AND filter. The query should only return candidates willing to accept ALL of the requirements.
        foreach ($operationalRequirements as $requirement) {
            $query->whereHas('acceptedOperationalRequirements', function ($query) use ($requirement) {
                $query->where('key', $requirement['key']);
            });
        }
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
