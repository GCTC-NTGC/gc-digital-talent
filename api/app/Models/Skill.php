<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class Skill
 *
 * @property int $id
 * @property string $key
 * @property array $name
 * @property array $description
 * @property array $keywords
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class Skill extends Model
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
        'name' => 'array',
        'description' => 'array',
        'keywords' => 'array',
    ];

    public function families() : BelongsToMany
    {
        return $this->belongsToMany(SkillFamily::class);
    }

    public function awardExperiences()
    {
        return $this->morphedByMany(
            AwardExperience::class,
            'experience',
            'experience_skills'
        )
        ->withTimestamps()
        ->withPivot('details')
        ->as('experienceSkillRecord');
    }
    public function communityExperiences()
    {
        return $this->morphedByMany(
            CommunityExperience::class,
            'experience',
            'experience_skills'
        )
        ->withTimestamps()
        ->withPivot('details')
        ->as('experienceSkillRecord');
    }
    public function educationExperiences()
    {
        return $this->morphedByMany(
            EducationExperience::class,
            'experience',
            'experience_skills'
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
            'experience_skills'
        )
        ->withTimestamps()
        ->withPivot('details')
        ->as('experienceSkillRecord');
    }
    public function workExperiences()
    {
        return $this->morphedByMany(
            WorkExperience::class,
            'experience',
            'experience_skills'
        )
        ->withTimestamps()
        ->withPivot('details')
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

    public function poolsEssentialSkills()
    {
        return $this->morphedByMany(
            Pool::class,
            'pools',
            'pools_essential_skills'
        )
        ->withTimestamps()
        ->withPivot('details')
        ->as('pools_essential_skills_pivot');
    }

    public function poolsNonessentialSkills()
    {
        return $this->morphedByMany(
            Pool::class,
            'pools',
            'pools_nonessential_skills'
        )
        ->withTimestamps()
        ->withPivot('details')
        ->as('pools_nonessential_skills_pivot');
    }
}
