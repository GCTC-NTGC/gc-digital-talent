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

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['details'];

    public function families(): BelongsToMany
    {
        return $this->belongsToMany(SkillFamily::class);
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
            ->as('experienceSkillRecord');
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
            ->as('experienceSkillRecord');
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
            ->as('experienceSkillRecord');
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

    public function poolsEssentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pools_essential_skills');
    }

    public function poolsNonessentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pools_essential_skills');
    }

    public function getDetailsAttribute()
    {
        return isset($this->experience_skill_pivot) ? $this->experience_skill_pivot->details : "";
    }
}
