<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Classification
 *
 * @property int $id
 * @property array $name
 * @property string $group
 * @property int $level
 * @property int $min_salary
 * @property int $max_salary
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class Classification extends Model
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
        'name' => 'array',
    ];

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
            get: fn (mixed $value, array $attributes) => $attributes['group'].'-'.sprintf('%02d', $attributes['level']),

        );
    }

    /**
     * Used to limit the results for the search page input
     * to IT up to level 5 and PM up to level 4
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
            $query->where('group', 'PM')->where('level', '<=', 4);
        });
    }
}
