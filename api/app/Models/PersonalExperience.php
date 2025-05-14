<?php

namespace App\Models;

use App\Traits\ExperienceWithHydration;
use App\Traits\ExperienceWithSkills;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class PersonalExperience
 *
 * @property string $id
 * @property string $user_id
 * @property string $title
 * @property string $description
 * @property ?\Illuminate\Support\Carbon $start_date
 * @property ?\Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class PersonalExperience extends Model
{
    use ExperienceWithHydration;
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
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public static $hydrationFields = [
        'title' => 'title',
        'description' => 'description',
        'start_date' => 'startDate',
        'end_date' => 'endDate',
    ];

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getExperienceType(): string
    {
        return PersonalExperience::class;
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // skill methods in api/app/Traits/ExperienceWithSkills.php
}
