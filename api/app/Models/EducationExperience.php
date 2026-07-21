<?php

namespace App\Models;

use App\Enums\EducationStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Lang;

/**
 * Class EducationExperience
 *
 * @property string $id
 * @property string $user_id
 * @property string $institution
 * @property string $area_of_study
 * @property string $thesis_title
 * @property ?Carbon $start_date
 * @property ?Carbon $end_date
 * @property string $education_type
 * @property string $status
 * @property string $details
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 * @property string $other_education_type
 * @property string $degree_type
 * @property string $license_or_accreditation
 * @property string $certification
 * @property string $course_name
 * @property string $fellowship_type
 * @property string $other_fellowship_type
 * @property ?Carbon $prospective_end_date
 */
class EducationExperience extends Experience
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
        'prospective_end_date' => 'date',
    ];

    protected static $hydrationFields = [
        'institution' => 'institution',
        'area_of_study' => 'areaOfStudy',
        'thesis_title' => 'thesisTitle',
        'education_type' => 'educationType',
        'status' => 'status',
        'start_date' => 'startDate',
        'end_date' => 'endDate',
        'other_education_type' => 'otherEducationType',
        'degree_type' => 'degreeType',
        'license_or_accreditation' => 'licenseOrAccreditation',
        'certification' => 'certification',
        'course_name' => 'courseName',
        'fellowship_type' => 'fellowshipType',
        'other_fellowship_type' => 'otherFellowshipType',
        'prospective_end_date' => 'prospectiveEndDate',
    ];

    public function awardExperiences(): MorphMany
    {
        return $this->morphMany(AwardExperience::class, 'related_experience');
    }

    public function getTitle(?string $lang = 'en'): string
    {
        return sprintf('%s %s %s', $this->area_of_study, Lang::get('common.at', [], $lang), $this->institution);
    }

    public function getExperienceType(): string
    {
        return EducationExperience::class;
    }

    public function getDateRange($lang = 'en'): string
    {
        if (
            ! $this->start_date
        ) {
            return Lang::get('common.not_completed', [], $lang);
        }

        $format = 'MMM Y';

        $start = $this->start_date->locale($lang)->isoFormat($format);
        $end = '';

        if ($this->status === EducationStatus::IN_PROGRESS->name) {
            if ((bool) $this->prospective_end_date) {
                $date = $this->prospective_end_date->locale($lang)->isoFormat($format);
                $text = Lang::get('common.expected_end_date', [], $lang);
                $end = "$date $text";
            } else {
                $end = Lang::get('common.missing_end_date', [], $lang);
            }
        } else {
            $this->end_date ?
                $end = $this->end_date->locale($lang)->isoFormat($format) :
                $end = Lang::get('common.missing_end_date', [], $lang);
        }

        return "$start - $end";
    }
}
