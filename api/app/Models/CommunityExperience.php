<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;

/**
 * Class CommunityExperience
 *
 * @property string $id
 * @property string $user_id
 * @property string $title
 * @property string $organization
 * @property string $project
 * @property ?\Illuminate\Support\Carbon $start_date
 * @property ?\Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class CommunityExperience extends Experience
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
        'title' => 'title',
        'organization' => 'organization',
        'project' => 'project',
        'start_date' => 'startDate',
        'end_date' => 'endDate',
    ];

    public function getTitle(?string $lang = 'en'): string
    {
        return sprintf('%s %s %s', $this->title, Lang::get('common.at', [], $lang), $this->organization);
    }

    public function getExperienceType(): string
    {
        return CommunityExperience::class;
    }

    public function getDateRange($lang = 'en'): string
    {
        $format = 'MMM Y';

        $start = $this->start_date->locale($lang)->isoFormat($format);
        $end = $this->end_date ? $this->end_date->locale($lang)->isoFormat($format) : Lang::get('common.present', [], $lang);

        return "$start - $end";
    }
}
