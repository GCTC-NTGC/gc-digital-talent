<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

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
    use HasRelationships;


    protected $keyType = 'string';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userSkills(): MorphToMany
    {
        return $this->morphToMany(UserSkill::class, 'experience', 'experience_skill')
        ->withTimestamps()
        ->withPivot('details')
        ->as('experience_skill_pivot');
    }

    public function skills(): HasManyThrough
    {
        return $this->hasManyDeepFromRelations($this->userSkills(), (new UserSkill())->skill())
            ->withPivot('experience_skill', ['created_at', 'updated_at', 'details'], ExperienceSkill::class, 'experience_skill_pivot');
    }

    /**
     * Sync means we will add missing skills, remove skills not in this array, and update the details of existing skills.
     *
     * @param [id => uuid, details => undefined|string] $skills - Skills must be an array of items, each of which must have an id, and optionally have a details string.
     * @return void
     */
    public function syncSkills($skills)
    {
        // TODO: make experience_skill soft-deletable (and restorable)

        $skillIds = collect($skills)->pluck('id');
        // First ensure that UserSkills exist for each of these skills
        $this->user->addSkills($skillIds);
        // Map skills to UserSkills, for syncing: https://laravel.com/docs/10.x/eloquent-relationships#syncing-associations
        $userSkills = $this->user->userSkills;
        $syncSkills = collect($skills)->flatMap(function ($skill) use ($userSkills) {
            $userSkillId = $userSkills->firstWhere('skill_id', $skill['id'])->id;
            $details = array_key_exists('details', $skill) ? $skill['details'] : null;
            return [$userSkillId => ['details' => $details]];
        });
        // Sync experience to userSkills
        $this->userSkills()->sync($syncSkills);
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }
}
