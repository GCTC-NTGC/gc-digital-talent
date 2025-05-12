<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    /** @return BelongsToMany<AwardExperience, $this> */
    public function awardExperiences()
    {
        return $this->belongsToMany(
            AwardExperience::class,
            'experience_skill',
            'user_skill_id',
            'experience_id'
        )
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill');
    }

    /** @return BelongsToMany<CommunityExperience, $this> */
    public function communityExperiences()
    {
        return $this->belongsToMany(
            CommunityExperience::class,
            'experience_skill',
            'user_skill_id',
            'experience_id'
        )
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill');
    }

    /** @return BelongsToMany<EducationExperience, $this> */
    public function educationExperiences()
    {
        return $this->belongsToMany(
            EducationExperience::class,
            'experience_skill',
            'user_skill_id',
            'experience_id'
        )
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill');
    }

    /** @return BelongsToMany<PersonalExperience, $this> */
    public function personalExperiences()
    {
        return $this->belongsToMany(
            PersonalExperience::class,
            'experience_skill',
            'user_skill_id',
            'experience_id'
        )
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill');
    }

    /** @return BelongsToMany<WorkExperience, $this> */
    public function workExperiences()
    {
        return $this->belongsToMany(
            WorkExperience::class,
            'experience_skill',
            'user_skill_id',
            'experience_id'
        )
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill');
    }

    // /** @return MorphToMany<Experience, $this> */
    // public function experiences(): MorphToMany
    // {
    //     return $this->belongsToMany(
    //         Experience::class,
    //         'experience_skill',
    //         'user_skill_id',
    //         'experience_id'
    //     )
    //         ->withTimestamps()
    //         ->withPivot(['details', 'deleted_at'])
    //         ->wherePivotNull('deleted_at')
    //         ->as('experience_skill');
    // }
}
