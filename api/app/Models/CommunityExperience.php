<?php

namespace App\Models;

use App\Models\Scopes\MatchExperienceType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class CommunityExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $organization
 * @property string $project
 * @property Illuminate\Support\Carbon $start_date
 * @property Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class CommunityExperience extends Experience
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
        'experience_type' => CommunityExperience::class,
    ];

    public function getTitle(): string
    {
        return sprintf('%s at %s', $this->title, $this->organization);
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
     * Interact with the experience's organization
     */
    protected function organization(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'organization'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'organization')
        );
    }

    /**
     * Interact with the experience's project
     */
    protected function project(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'project'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'project')
        );
    }

    /**
     * Interact with the experience's start date
     */
    protected function startDate(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyDate($attributes, 'start_date'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyDate($value, $attributes, 'start_date')
        );
    }

    /**
     * Interact with the experience's end date
     */
    protected function endDate(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyDate($attributes, 'end_date'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyDate($value, $attributes, 'end_date')
        );
    }
}
