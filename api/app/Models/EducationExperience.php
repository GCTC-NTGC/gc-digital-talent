<?php

namespace App\Models;

use App\Models\Scopes\MatchExperienceType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;

/**
 * Class EducationExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $institution
 * @property string $area_of_study
 * @property string $thesis_title
 * @property ?\Illuminate\Support\Carbon $start_date
 * @property ?\Illuminate\Support\Carbon $end_date
 * @property string $type
 * @property string $status
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
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
     */
    protected $attributes = [
        'experience_type' => EducationExperience::class,
    ];

    protected static $hydrationFields = [
        'institution' => 'institution',
        'area_of_study' => 'areaOfStudy',
        'thesis_title' => 'thesisTitle',
        'type' => 'type',
        'status' => 'status',
        'start_date' => 'startDate',
        'end_date' => 'endDate',
    ];

    public function getTitle(?string $lang = 'en'): string
    {
        return sprintf('%s %s %s', $this->area_of_study, Lang::get('common.at', [], $lang), $this->institution);
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
        return $this->makeJsonPropertyStringAttribute('institution');
    }

    /**
     * Interact with the experience's area of study
     */
    protected function areaOfStudy(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('area_of_study');
    }

    /**
     * Interact with the experience's thesis title
     */
    protected function thesisTitle(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('thesis_title');
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

    /**
     * Interact with the experience's type
     */
    protected function type(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('type');
    }

    /**
     * Interact with the experience's status
     */
    protected function status(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('status');
    }
}
