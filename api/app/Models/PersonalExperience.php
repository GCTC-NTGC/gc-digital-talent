<?php

namespace App\Models;

use App\Models\Scopes\MatchExperienceType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class PersonalExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $description
 * @property ?\Illuminate\Support\Carbon $start_date
 * @property ?\Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class PersonalExperience extends Experience
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
     */
    protected $attributes = [
        'experience_type' => PersonalExperience::class,
    ];

    protected static $hydrationFields = [
        'title' => 'title',
        'description' => 'description',
        'start_date' => 'startDate',
        'end_date' => 'endDate',
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
        return $this->makeJsonPropertyStringAttribute('title');
    }

    /**
     * Interact with the experience's description
     */
    protected function description(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('description');
    }

    /**
     * Interact with the experience's start date
     */
    protected function startDate(): Attribute
    {
        return $this->makeJsonPropertyDateAttribute('start_date');
    }

    /**
     * Interact with the experience's end date
     */
    protected function endDate(): Attribute
    {
        return $this->makeJsonPropertyDateAttribute('end_date');
    }
}
