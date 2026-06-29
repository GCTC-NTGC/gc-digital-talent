<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Class AwardExperience
 *
 * @property string $id
 * @property string $user_id
 * @property string $title
 * @property string $issued_by
 * @property ?Carbon $awarded_date
 * @property string $awarded_to
 * @property string $awarded_scope
 * @property string $details
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 * @property string $project_name
 * @property Experience $relatedExperience
 */
class AwardExperience extends Experience
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'awarded_date' => 'date',
    ];

    protected static $hydrationFields = [
        'title' => 'title',
        'issued_by' => 'issuedBy',
        'awarded_date' => 'awardedDate',
        'awarded_to' => 'awardedTo',
        'awarded_scope' => 'awardedScope',
    ];

    public function relatedExperience()
    {
        return $this->morphTo();
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getExperienceType(): string
    {
        return AwardExperience::class;
    }

    public function getDateRange($lang = 'en'): string
    {
        $format = 'MMM Y';

        return $this->awarded_date->locale($lang)->isoFormat($format);
    }
}
