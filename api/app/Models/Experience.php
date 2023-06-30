<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * Class Experience
 *
 * @property int $id
 * @property int $user_id
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

abstract class Experience extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';

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
}
