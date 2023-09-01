<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class UserSkill
 *
 * @property string $id
 * @property string $user_id
 * @property string $skill_id
 * @property string $skill_level
 * @property string $when_skill_used
 * @property int $top_skills_rank
 * @property int $improve_skills_rank
 */
class UserSkill extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'skill_id',
        'skill_level',
        'when_skill_used',
        'top_skills_rank',
        'improve_skills_rank',
    ];

    /**
     * model lifecycle methods
     */
    protected static function booted(): void
    {
        static::deleting(
            function (UserSkill $userSkill) {
                // soft delete all experience_skill records containing the model
                ExperienceSkill::where('user_skill_id', $userSkill->id)->delete();
            }
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class, 'skill_id')->withTrashed();  // include soft deleted skills
    }

    public function awardExperiences()
    {
        return $this->morphedByMany(
            AwardExperience::class,
            'experience',
            'experience_skill'
        )
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
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
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
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
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
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
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
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
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill_pivot');
    }

    public function getExperiencesAttribute()
    {
        $collection = collect();
        $collection = $collection->merge($this->awardExperiences);
        $collection = $collection->merge($this->communityExperiences);
        $collection = $collection->merge($this->educationExperiences);
        $collection = $collection->merge($this->personalExperiences);
        $collection = $collection->merge($this->workExperiences);

        return $collection;
    }
}
