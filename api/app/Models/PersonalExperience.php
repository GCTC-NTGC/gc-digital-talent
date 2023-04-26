<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * Class PersonalExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $description
 * @property Illuminate\Support\Carbon $start_date
 * @property Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class PersonalExperience extends Model
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
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills(): MorphToMany
    {
        return $this->morphToMany(Skill::class, 'experience', 'experience_skill')
            ->withTimestamps()
            ->withPivot('details')
            ->as('experience_skill_pivot');
    }

    public function poolCandidates(): MorphToMany
    {
        return $this->morphToMany(PoolCandidate::class, 'experience', 'pool_candidate_minimum_criteria_experience')
            ->withTimestamps();
    }
}
