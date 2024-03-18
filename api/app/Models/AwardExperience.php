<?php

namespace App\Models;

use App\Models\Scopes\MatchExperienceType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class AwardExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $issued_by
 * @property Illuminate\Support\Carbon $awarded_date
 * @property string $awarded_to
 * @property string $awarded_scope
 * @property string $details
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class AwardExperience extends Experience
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'experiences';

    /**
     * Default values for attributes
     *
     * @var array an array with attribute as key and default as value
     */
    protected $attributes = [
        'experience_type' => AwardExperience::class,
    ];

    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new MatchExperienceType);
    }

    /**
     * Interact with the experience's title
     */
    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'title'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'title')
        );
    }

    /**
     * Interact with the experience's title
     */
    protected function issuedBy(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'issued_by'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'issued_by')
        );
    }

    /**
     * Interact with the experience's award date
     */
    protected function awardedDate(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyDate($attributes, 'awarded_date'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyDate($value, $attributes, 'awarded_date')
        );
    }

    /**
     * Interact with the experience's title
     */
    protected function awardedTo(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'awarded_to'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'awarded_to')
        );
    }

    /**
     * Interact with the experience's title
     */
    protected function awardedScope(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'awarded_scope'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'awarded_scope')
        );
    }
}
