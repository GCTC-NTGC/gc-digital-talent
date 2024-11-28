<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class ApplicantFilter
 *
 * @property string $id
 * @property bool $has_diploma
 * @property bool $has_disability
 * @property bool $is_indigenous
 * @property bool $is_visible_minority
 * @property bool $is_woman
 * @property array $position_duration
 * @property string $language_ability
 * @property array $location_preferences
 * @property array $operational_requirements
 * @property array $qualified_streams
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class ApplicantFilter extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'location_preferences' => 'array',
        'operational_requirements' => 'array',
        'position_duration' => 'array',
        'qualified_streams' => 'array',
    ];

    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'applicant_filter_classification');
    }

    public function qualifiedClassifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'applicant_filter_qualified_classification');
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'applicant_filter_skill');
    }

    public function pools(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'applicant_filter_pool');
    }

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    public function workStreams(): BelongsToMany
    {
        return $this->belongsToMany(WorkStream::class);
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
