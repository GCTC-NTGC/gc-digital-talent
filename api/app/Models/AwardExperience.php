<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Class AwardExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $issued_by
 * @property Illuminate\Support\Carbon $awarded_date
 * @property string $recipient_type
 * @property string $recognition_type
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class AwardExperience extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'awarded_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function experienceSkills(): MorphMany
    {
        return $this->morphMany(ExperienceSkill::class, 'experience');
    }
}
