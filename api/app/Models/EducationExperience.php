<?php

namespace App\Models;

use App\Enums\DegreeType;
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\FellowshipType;
use App\Utilities\LanguageHelpers;
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
 * @property string $type Replaced by education_type - used in V1 snapshots
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
        'type' => 'type', // preserved for snapshot version 1
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

    public function getTitle(?string $lang = 'en', ?int $experienceVersion = null): string
    {
        $type = '';
        $subject = $this->area_of_study;
        if ((bool) $experienceVersion && $experienceVersion === 1) {
            // V1 Snapshot representation of an Education Experience
            $type = LanguageHelpers::localizeEnum($this->type, DegreeType::class, $lang);
        } else {
            // V2 and onwards representation of an Education Experience
            switch ($this->education_type) {
                case EducationType::DEGREE_DIPLOMA_CERTIFICATE->name:
                    $type = LanguageHelpers::localizeEnum($this->degree_type, DegreeType::class, $lang);
                    break;
                case EducationType::FELLOWSHIP->name:
                    $type = $this->fellowship_type === FellowshipType::OTHER->name
                        ? $this->other_fellowship_type
                        : LanguageHelpers::localizeEnum($this->fellowship_type, FellowshipType::class, $lang);
                    break;
                case EducationType::OTHER->name:
                    $type = $this->other_education_type ?? Lang::get('headings.other_type_of_education', [], $lang);
                    break;
                default:
                    $type = LanguageHelpers::localizeEnum($this->education_type, EducationType::class, $lang);
            }
            if ($this->education_type === EducationType::PROFESSIONAL_CERTIFICATION->name) {
                $subject = $this->certification;
            } elseif ($this->education_type === EducationType::LICENSE_ACCREDITATION->name) {
                $subject = $this->license_or_accreditation;
            }
        }

        $titleComponents = [];
        if ($type) {
            $titleComponents[] = $type;
        }
        if ($subject) {
            $titleComponents[] = ($type ? Lang::get('common.in', [], $lang).' ' : '')
            .$subject;
        }
        if ($this->institution) {
            $titleComponents[] = Lang::get('common.from', [], $lang).' '.$this->institution;
        }

        return trim(implode(' ', $titleComponents));
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
