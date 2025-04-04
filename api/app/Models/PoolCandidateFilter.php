<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class PoolCandidateFilter
 *
 * @deprecated Replaced by ApplicantFilter.
 *
 * @property int $id
 * @property bool $has_diploma
 * @property bool $has_disability
 * @property bool $is_indigenous
 * @property bool $is_visible_minority
 * @property bool $is_woman
 * @property string $language_ability
 * @property array $work_regions
 * @property array $operational_requirements
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $deleted_at
 */
class PoolCandidateFilter extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'requested_date' => 'date',
        'work_regions' => 'array',
        'operational_requirements' => 'array',
    ];

    /** @return BelongsToMany<Classification, $this> */
    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'classification_pool_candidate_filter');
    }

    /** @return BelongsToMany<Pool, $this> */
    public function pools(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pool_pool_candidate_filter');
    }

    /** @return HasOne<PoolCandidateSearchRequest, $this> */
    public function poolCandidateSearchRequest(): HasOne
    {
        return $this->hasOne(PoolCandidateSearchRequest::class);
    }

    /* these fields are factored out into a sub-object by this accessor to mirror the way they are queried */
    public function getEquityAttribute()
    {
        return [
            'is_woman' => $this->is_woman,
            'has_disability' => $this->has_disability,
            'is_indigenous' => $this->is_indigenous,
            'is_visible_minority' => $this->is_visible_minority,
        ];
    }

    /* this fields are factored out into a sub-object by this mutator so they can be OR'd together by the query builder */
    public function setEquityAttribute($equityInput)
    {
        $this->is_woman = $equityInput['is_woman'];
        $this->has_disability = $equityInput['has_disability'];
        $this->is_indigenous = $equityInput['is_indigenous'];
        $this->is_visible_minority = $equityInput['is_visible_minority'];
    }
}
