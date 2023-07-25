<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class User
 *
 * @property string $id
 * @property string $user_id
 * @property string $skill_id
 */
class UserSkill extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $keyType = 'string';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class, 'skill_id');
    }

    public function awardExperiences()
    {
        return $this->morphedByMany(
            AwardExperience::class,
            'experience',
            'experience_skill'
        )
            ->withTimestamps()
            ->withPivot('details')
            ->as('experience_skill');
    }
    public function communityExperiences()
    {
        return $this->morphedByMany(
            CommunityExperience::class,
            'experience',
            'experience_skill'
        )
            ->withTimestamps()
            ->withPivot('details')
            ->as('experience_skill');
    }
    public function educationExperiences()
    {
        return $this->morphedByMany(
            EducationExperience::class,
            'experience',
            'experience_skill'
        )
            ->withTimestamps()
            ->withPivot('details')
            ->as('experience_skill');
    }
    public function personalExperiences()
    {
        return $this->morphedByMany(
            PersonalExperience::class,
            'experience',
            'experience_skill'
        )
            ->withTimestamps()
            ->withPivot('details')
            ->as('experience_skill');
    }
    public function workExperiences()
    {
        return $this->morphedByMany(
            WorkExperience::class,
            'experience',
            'experience_skill'
        )
            ->withTimestamps()
            ->withPivot('details')
            ->as('experience_skill_pivot');
    }
}
