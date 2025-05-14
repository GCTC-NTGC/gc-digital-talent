<?php

namespace App\Traits;

use App\Models\ExperienceSkill;
use App\Models\UserSkill;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

trait ExperienceWithSkills
{
    use HasRelationships;

    /** @return MorphToMany<UserSkill, $this> */
    public function userSkills(): MorphToMany
    {
        return $this->morphToMany(UserSkill::class, 'experience', 'experience_skill')
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill');
    }

    public function skills(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->userSkills(), (new UserSkill)->skill())
            ->withPivot('experience_skill', ['created_at', 'updated_at', 'details'])
            ->whereNull('experience_skill.deleted_at')
            ->withTrashed(); // from the deep relation $this->userSkills->skills fetch soft deleted skills but not userSkills
    }

    /** @return HasMany<ExperienceSkill, $this> */
    public function experienceSkills(): HasMany
    {
        return $this->hasMany(ExperienceSkill::class);
    }

    /**
     * Sync means we will add missing skills, remove skills not in this array, and update the details of existing skills.
     *
     * @param  array<string, array<string, string>>|null  $skills  - Skills must be an array of items, each of which must have an id, and optionally have a details string.
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

        // Soft-delete any existing ExperienceSkills left out of this sync operation
        ExperienceSkill::where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereNotIn('skill_id', $skillIds);
            })
            ->delete();

        // Now connect the skills which ARE in this sync operation
        $this->connectSkills($skills);
    }

    /**
     * Connect means we will add missing skills and update the details of existing skills, but not remove any skills.
     *
     * @param  array<string, array<string, string>>|null  $skills  - Skills must be an array of items, each of which must have an id, and optionally have a details string.
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

        $userSkills = UserSkill::where('user_id', $this->user_id)->get(); // Get this users UserSkills once, to avoid repeated db calls.

        // Restore soft-deleted experience-skills which need to be connected.
        ExperienceSkill::onlyTrashed()
            ->where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereIn('skill_id', $skillIds);
            })
            ->with('userSkill')
            ->restore();

        // Now get existing pivots (for updating details)
        $existingExperienceSkills = ExperienceSkill::where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereIn('skill_id', $skillIds);
            })
            ->with('userSkill')
            ->get();

        // We can't use the userSkills()->sync() operation because it will hard-delete ExperienceSkills, so loop through manually.
        foreach ($skills as $newSkill) {
            $newSkill = collect($newSkill);
            $existingPivot = $existingExperienceSkills->firstWhere('userSkill.skill_id', $newSkill->get('id'));
            if ($existingPivot) { // If pivot already exists, update details
                if ($newSkill->has('details')) { // Only update details if it was defined in the input args
                    $existingPivot->details = $newSkill->get('details');
                    $existingPivot->save();
                }
            } else { // If pivot doesn't exist yet, create it
                $userSkillId = $userSkills->where('skill_id', $newSkill->get('id'))->first()->id;
                $detailsArray = $newSkill->only('details')->toArray();
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
        // Soft-delete these experience-skills
        ExperienceSkill::where('experience_id', $this->id)
            ->whereIn('user_skill_id', $userSkillIds)
            ->delete();
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }
}
