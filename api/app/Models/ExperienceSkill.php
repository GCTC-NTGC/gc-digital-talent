<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\MorphPivot;

class ExperienceSkill extends MorphPivot
{

    public function userSkill(): BelongsTo
    {
        return $this->belongsTo(UserSkill::class);
    }

    public function skill(): HasOneThrough
    {
        return $this->through('userSkill')->has('skill');
        // ->withPivot('details')
        // ->withTimestamps()
        // ->as('experience_skill_pivot');
    }
}
