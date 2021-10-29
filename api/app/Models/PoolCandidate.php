<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function scopeWithFilter($query, $filter)
    {
        if (array_key_exists('classifications', $filter)) {
            // Classifications act as an OR filter. The query should return candidates with any of the classifications.
            // A single whereHas clause for the relationship, containing mulitple orWhere clauses accomplishes this.
            $query->whereHas('classifications', function ($query) use ($filter) {
                foreach ($filter['classifications'] as $classification) {
                    $query->orWhere(function($query) use ($classification) {
                        $query->where('group', $classification['group'])->where('level', $classification['level']);
                    });
                }
            });
        }
        if (array_key_exists('cmoAssets', $filter)) {
            // CmoAssets act as an AND filter. The query should only returns candidates with ALL of the assets.
            // This is accomplished with multiple whereHas clauses for the cmoAssets relationship.
            foreach ($filter['cmoAssets'] as $cmoAsset) {
                $query->whereHas('cmoAssets', function ($query) use ($cmoAsset) {
                    $query->where('key', $cmoAsset['key']);
                });
            }
        }
    }
}
