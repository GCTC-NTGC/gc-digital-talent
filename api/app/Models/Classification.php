<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Number;
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
 * @property string $displayName
 * @property ?string $salaryRange
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 * @property bool $is_available_in_search
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
     * Get the formatted classification name, e.g. IT-01: Information Technology
     */
    protected function displayName(): Attribute
    {
        $locale = app()->getLocale();
        $dividingColon = Lang::get('common.dividing_colon', [], $locale);
        $name = $this->name[$locale];

        return Attribute::make(
            get: fn () => $this->formattedGroupAndLevel.$dividingColon.$name,
        );
    }

    public function getDefinition(): array
    {
        $locale = app()->getLocale();

        return [
            'term' => $this->formattedGroupAndLevel,
            'definition' => [
                'en' => $this->name['en'],
                'fr' => $this->name['fr'],
                'localized' => $this->name[$locale] ?? null,
            ],
        ];
    }

    /**
     * Get the salary range in Canadian currency, e.g. $60,000 - $80,000
     */
    protected function salaryRange(): Attribute
    {
        $locale = App::getLocale() === 'fr' ? 'fr-CA' : 'en-CA';

        return Attribute::get(function (mixed $value, array $attributes) use ($locale) {
            $salaries = array_filter([$this->min_salary, $this->max_salary]);

            if (empty($salaries)) {
                return null;
            }

            $formatted = array_map(
                fn (int $salary) => Number::currency($salary, 'CAD', $locale, 0),
                $salaries
            );

            return implode(' - ', $formatted);
        });
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
