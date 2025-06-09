<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphPivot;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

/**
 * Class UserSkill
 *
 * @mixin \App\Models\Skill
 *
 * @property string $id
 * @property string $user_id
 * @property string $skill_id
 * @property Skill $skill
 * @property string $skill_level
 * @property string $when_skill_used
 * @property int $top_skills_rank
 * @property int $improve_skills_rank
 * @property-read \App\Models\ExperienceSkill $experience_skill
 * @property ?\Illuminate\Support\Carbon $deleted_at
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

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** @return BelongsTo<Skill, $this> */
    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class, 'skill_id')->withTrashed();  // include soft deleted skills
    }

    /** @return MorphToMany<AwardExperience, $this, MorphPivot, 'experience_skill'> */
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

    /** @return MorphToMany<CommunityExperience, $this, MorphPivot, 'experience_skill'> */
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

    /** @return MorphToMany<EducationExperience, $this, MorphPivot, 'experience_skill'> */
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

    /** @return MorphToMany<PersonalExperience, $this, MorphPivot, 'experience_skill'> */
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

    /** @return MorphToMany<WorkExperience, $this, MorphPivot, 'experience_skill'> */
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
            ->as('experience_skill');
    }

    /** @return Collection<string|int, Experience> */
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
