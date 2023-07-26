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
        ->as('experience_skill');
    }

    public function skills(): HasManyThrough
    {
        return $this->hasManyDeepFromRelations($this->userSkills(), (new UserSkill())->skill())
            ->withPivot('experience_skill', ['created_at', 'updated_at', 'details']);
    }

    /**
     * Sync means we will add missing skills, remove skills not in this array, and update the details of existing skills.
     *
     * @param [id => uuid, details => undefined|string] $skills - Skills must be an array of items, each of which must have an id, and optionally have a details string.
     * @return void
     */
    public function syncSkills($skills)
    {
        if ($skills === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }

        $skillIds = collect($skills)->pluck('id');
        // First ensure that UserSkills exist for each of these skills
        $this->user->addSkills($skillIds);
        // Map skills to UserSkills, for syncing: https://laravel.com/docs/10.x/eloquent-relationships#syncing-associations
        $userSkills = $this->user->userSkills;
        $syncSkills = collect($skills)->flatMap(function ($skill) use ($userSkills) {
            $skill = collect($skill);
            $userSkillId = $userSkills->firstWhere('skill_id', $skill->get('id'))->id;
            return $skill->has('details')
                ? [$userSkillId => ['details' => $skill->get('details', null)]]
                : [$userSkillId];
        });
        // Sync experience to userSkills
        $this->userSkills()->sync($syncSkills);
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }

     /**
     * Connect means we will add missing skills and update the details of existing skills, but not remove any skills.
     *
     * @param [id => uuid, details => undefined|string] $skills - Skills must be an array of items, each of which must have an id, and optionally have a details string.
     * @return void
     */
    public function connectSkills($skills)
    {
        if ($skills === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }

        // First ensure that UserSkills exist for each of these skills
        $skillIds = collect($skills)->pluck('id');
        $this->user->addSkills($skillIds);

        $skillsAlreadyAttachedToExperience = $this->userSkills()->pluck('skill_id');

        // I wanted to use syncWithoutDetaching, but it doesn't allow for updating pivot values like sync does.
        foreach($skills as $newSkill) {
            $newSkill = collect($newSkill);
            $userSkillId = $this->user->userSkills->firstWhere('skill_id', $newSkill->get('id'))->id;
            $detailsArray = $newSkill->only('details')->toArray();
            // If experienceSkill already exists
            if ($skillsAlreadyAttachedToExperience->contains($newSkill->get('id'))) {
                // And details is defined, then update details
                if ($newSkill->has('details')) {
                    $this->userSkills()->updateExistingPivot($userSkillId, $detailsArray);
                }
            // Otherwise experienceSkill doesn't exist, so add it now
            } else {
                $this->userSkills()->attach($userSkillId, $detailsArray);
            }
        }
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }

    public function disconnectSkills($skillIds)
    {
        if ($skillIds === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }
        // Find the userSkills that correspond to these skills.
        $userSkillIds = $this->user->userSkills()->whereIn('skill_id', $skillIds)->pluck('id');
        // Simply detach the required userSkills
        $this->userSkills()->detach($userSkillIds);
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }
}
