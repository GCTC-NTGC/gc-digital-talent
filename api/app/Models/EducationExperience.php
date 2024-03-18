<?php

namespace App\Models;

use App\Models\Scopes\MatchExperienceType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class EducationExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $institution
 * @property string $area_of_study
 * @property string $thesis_title
 * @property Illuminate\Support\Carbon $start_date
 * @property Illuminate\Support\Carbon $end_date
 * @property string $type
 * @property string $status
 * @property string $details
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class EducationExperience extends Experience
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
        'experience_type' => EducationExperience::class,
    ];

    public function getTitle(): string
    {
        return sprintf('%s at %s', $this->area_of_study, $this->institution);
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new MatchExperienceType);
    }

    /**
     * Interact with the experience's institution
     */
    protected function institution(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'institution'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'institution')
        );
    }

    /**
     * Interact with the experience's area of study
     */
    protected function areaOfStudy(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'area_of_study'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'area_of_study')
        );
    }

    /**
     * Interact with the experience's thesis title
     */
    protected function thesisTitle(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'thesis_title'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'thesis_title')
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

    /**
     * Interact with the experience's type
     */
    protected function type(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'type'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'type')
        );
    }

    /**
     * Interact with the experience's status
     */
    protected function status(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $this::getJsonPropertyString($attributes, 'status'),
            set: fn (mixed $value, array $attributes) => $this::setJsonPropertyString($value, $attributes, 'status')
        );
    }
}
