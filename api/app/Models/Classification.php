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

    public function getDefinition(): array
    {
        return [[
            'term' => $this->displayName ?? 'TERM',
            'definition' => [
                'en' => 'EN',
                'fr' => 'FR',
                'localized' => 'LOCALIZED',
            ],
        ]];
    }

    /**
     * Used to limit the results for the search page input
     */
    public static function scopeAvailableInSearch(Builder $query, bool $availableInSearch)
    {
        if (! $availableInSearch) {
            return;
        }

        $query->where('is_available_in_search', true);
    }
}
