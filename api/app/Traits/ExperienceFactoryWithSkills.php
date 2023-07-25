<?php

namespace App\Traits;

use App\Models\Skill;

trait ExperienceFactoryWithSkills
{
    /**
     * Add skills to an experience
     */
    public function withSkills(Int $count = 3)
    {
        return $this->afterCreating(function ($model) use ($count) {
            $skills = Skill::inRandomOrder()->limit($count)->get();
            $model->syncSkills($skills->only(['id']));
        });
    }
}
