<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphPivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Class ExperienceSkill
 *
 * @property int $id
 * @property string $details
 * @property int $skill_id
 * @property int $experience_id
 * @property string $experience_type
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class ExperienceSkill extends MorphPivot
{
    use HasFactory;

    // We could put other relationships here if needed

    /* protected $keyType = 'string';

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }

    public function experience(): MorphTo
    {
        return $this->morphTo();
    } */
}
