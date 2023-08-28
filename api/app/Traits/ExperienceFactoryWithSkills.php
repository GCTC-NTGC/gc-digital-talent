<?php

namespace App\Traits;

use App\Models\Skill;

trait ExperienceFactoryWithSkills
{
    /**
     * Add skills to an experience.
     * NOTE: does not create Skills. Skills must already be seeded!!!
     */
    public function withSkills(Int $count = 3)
    {
        return $this->afterCreating(function ($model) use ($count) {
            $skills = Skill::inRandomOrder()->limit($count)->get();
            $model->syncSkills($skills);
        });
    }
}
