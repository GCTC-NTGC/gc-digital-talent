<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\Relation;

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

    public function userSkills(): MorphToMany
    {
        return $this->hasMany(UserSkill::class)->using(ExperienceSkill::class);
            // ->withTimestamps()
            // ->withPivot('details')
            // ->as('experience_skill_pivot');
    }

    // public function skills(): MorphToMany
    // {
    //     return $this->morphToManyThrough(Skill::class, 'experience', ExperienceSkill::class)
    //         ->withTimestamps()
    //         ->withPivot('details')
    //         ->as('experience_skill_pivot');
    // }

    public function skills(): HasManyThrough
    {
        return $this->hasManyThrough(Skill::class, ExperienceSkill::class, 'experience_id');
            // ->where('experience_type', array_search(static::class, Relation::morphMap()) ?: static::class);

    }
}
