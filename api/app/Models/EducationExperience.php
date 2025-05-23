<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;

/**
 * Class EducationExperience
 *
 * @property string $id
 * @property string $user_id
 * @property string $institution
 * @property string $area_of_study
 * @property string $thesis_title
 * @property ?\Illuminate\Support\Carbon $start_date
 * @property ?\Illuminate\Support\Carbon $end_date
 * @property string $type
 * @property string $status
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class EducationExperience extends Experience
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
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

    public function getExperienceType(): string
    {
        return EducationExperience::class;
    }

    public function getDateRange($lang = 'en'): string
    {
        $format = 'MMM Y';

        $start = $this->start_date->locale($lang)->isoFormat($format);
        $end = $this->end_date ? $this->end_date->locale($lang)->isoFormat($format) : Lang::get('common.present', [], $lang);

        return "$start - $end";
    }
}
