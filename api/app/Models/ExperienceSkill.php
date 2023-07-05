<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

/**
 * Represents the pivot table between Experiences and UserSkills.
 *
 * Currently this model only exists so it can be referenced on the Skills relation of Experience.php.
 */
class ExperienceSkill extends Model
{
}
