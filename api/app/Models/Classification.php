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
 * @property string $formattedGroupAndLevel
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property bool $is_available_in_search
 * @property array $display_name
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
        'display_name' => LocalizedString::class,
    ];

    /** @return HasMany<GenericJobTitle, $this> */
    public function genericJobTitles(): HasMany
    {
        return $this->hasMany(GenericJobTitle::class);
    }

    /**
     * Get the formatted classification group and level, e.g. IT-01
     */
    protected function formattedGroupAndLevel(): Attribute
    {
        /** @disregard P1003 Not using values */
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $attributes['group'].'-'.($attributes['level'] < 10 ? '0' : '').$attributes['level'],
        );
    }

    /**
     * Used to limit the results for the search page input
     * to IT up to level 5; PM up to level 6; CR level 4; EX level 3, EX level 4; AS level 3, AS level 5; EC level 2 to 8.
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
        })->orWhere(function ($query) {
            $query->where('group', 'EC')->where('level', '>=', 2)->where('level', '<=', 8);
        });
    }
}
