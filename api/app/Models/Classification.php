<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

/**
 * Class Classification
 *
 * @property int $id
 * @property array $name
 * @property string $group
 * @property int $level
 * @property int $min_salary
 * @property int $max_salary
 * @property string $displayName
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class Classification extends Model
{
    use HasFactory;
    use HasJsonRelationships;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'name' => LocalizedString::class,
    ];

    /** @return HasMany<GenericJobTitle, $this> */
    public function genericJobTitles(): HasMany
    {
        return $this->hasMany(GenericJobTitle::class);
    }

    /**
     * Get the classification display name, e.g. IT-01
     */
    protected function displayName(): Attribute
    {
        /** @disregard P1003 Not using values */
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $attributes['group'].'-'.($attributes['level'] < 10 ? '0' : '').$attributes['level'],
        );
    }

    /**
     * Used to limit the results for the search page input
     * to IT up to level 5; PM up to level 6; CR level 4; EX level 3, EX level 4; AS level 3, AS level 5.
     *
     * TODO: Update in #9483 to derive from new column
     */
    public static function scopeAvailableInSearch(Builder $query, bool $availableInSearch)
    {
        if (! $availableInSearch) {
            return;
        }

        $query->where(function ($query) {
            $query->where('group', 'IT')->where('level', '<=', 5);
        })->orWhere(function ($query) {
            $query->where('group', 'PM')->where('level', '<=', 6);
        })->orWhere(function ($query) {
            $query->where('group', 'CR')->where('level', '=', 4);
        })->orWhere(function ($query) {
            $query->where('group', 'EX')->where('level', '=', 3);
        })->orWhere(function ($query) {
            $query->where('group', 'EX')->where('level', '=', 4);
        })->orWhere(function ($query) {
            $query->where('group', 'AS')->where('level', '=', 3);
        })->orWhere(function ($query) {
            $query->where('group', 'AS')->where('level', '=', 5);
    });
    }
}
