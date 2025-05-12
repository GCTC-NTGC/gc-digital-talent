<?php

namespace App\Models;

use App\Traits\ExperienceWithSkills;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class AwardExperience
 *
 * @property string $id
 * @property string $user_id
 * @property string $title
 * @property string $issued_by
 * @property ?\Illuminate\Support\Carbon $awarded_date
 * @property string $awarded_to
 * @property string $awarded_scope
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class AwardExperience extends Model
{
    use ExperienceWithSkills;
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array
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

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getExperienceType(): string
    {
        return AwardExperience::class;
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // skill methods in api/app/Traits/ExperienceWithSkills.php
}
