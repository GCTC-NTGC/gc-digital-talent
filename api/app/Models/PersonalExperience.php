<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Lang;

/**
 * Class PersonalExperience
 *
 * @property string $id
 * @property string $user_id
 * @property string $title
 * @property ?Carbon $start_date
 * @property ?Carbon $end_date
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property string $learning_description
 * @property string $organization
 */
class PersonalExperience extends Experience
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($experience) {
            // Delete all related award experiences
            $experience->awardExperiences->each(function ($award) {
                $award->relatedExperience()->dissociate();
                $award->save();
            });
        });
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected static $hydrationFields = [
        'title' => 'title',
        'start_date' => 'startDate',
        'end_date' => 'endDate',
        'learning_description' => 'learningDescription',
        'organization' => 'organization',
    ];

    public function awardExperiences(): MorphMany
    {
        return $this->morphMany(AwardExperience::class, 'related_experience');
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getExperienceType(): string
    {
        return PersonalExperience::class;
    }

    public function getDateRange($lang = 'en'): string
    {
        $format = 'MMM Y';

        $start = $this->start_date->locale($lang)->isoFormat($format);
        $end = $this->end_date ? $this->end_date->locale($lang)->isoFormat($format) : Lang::get('common.present', [], $lang);

        return "$start - $end";
    }
}
