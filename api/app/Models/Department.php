<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

/**
 * Class Department
 *
 * @property string $id
 * @property int $department_number
 * @property array $name
 * @property int $org_identifier
 * @property bool $is_core_public_administration
 * @property bool $is_central_agency
 * @property bool $is_science
 * @property bool $is_regulatory
 * @property string $size
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $deleted_at
 */
class Department extends Model
{
    use HasFactory;
    use HasJsonRelationships;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be case.
     */
    protected $casts = [
        'name' => LocalizedString::class,
        'org_identifier' => 'integer',
        'is_core_public_administration' => 'boolean',
        'is_central_agency' => 'boolean',
        'is_science' => 'boolean',
        'is_regulatory' => 'boolean',
    ];

    /** @return HasMany<PoolCandidateSearchRequest, $this> */
    public function poolCandidateSearchRequests(): HasMany
    {
        return $this->hasMany(PoolCandidateSearchRequest::class);
    }

    /**
     * Scopes/filters
     */

    /**
     * Re-useable scope to filter by an array of department ids
     *
     * @param  array<string>|null  $departmentIds  An array of department ids
     */
    public static function scopeDepartmentsByIds(Builder $query, ?array $departmentIds): Builder
    {
        if (empty($departmentIds)) {
            return $query;
        }

        $query->whereIn('id', $departmentIds);

        return $query;
    }

    /** @return HasMany<Pool, $this> */
    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }
}
