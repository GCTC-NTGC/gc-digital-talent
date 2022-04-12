<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * Class AwardExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $issued_by
 * @property Illuminate\Support\Carbon $awarded_date
 * @property string $awarded_to
 * @property string $awarded_scope
 * @property string $details
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

    public function skills(): MorphToMany
    {
        return $this->morphToMany(Skill::class, 'experience', 'experience_skills')
            ->withTimestamps()
            ->withPivot('details')
            ->as('experience_skill_pivot');
    }
}
