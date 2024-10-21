<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class ExperienceSkill
 *
 * @property string $id
 * @property string $experience_id
 * @property string $user_skill_id
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $deleted_at
 */
class ExperienceSkill extends Model
{
    use HasRelationships;
    use SoftDeletes;

    protected $keyType = 'string';

    protected $table = 'experience_skill';

    public function experience(): BelongsTo
    {
        return $this->belongsTo(Experience::class);
    }

    public function userSkill(): BelongsTo
    {
        return $this->belongsTo(UserSkill::class);
    }

    public function skill()
    {
        return $this->hasOneDeepFromRelations($this->userSkill(), (new UserSkill)->skill());
    }
}
