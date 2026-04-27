<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Staudenmeir\EloquentHasManyDeep\HasOneDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class ExperienceSkill
 *
 * @property string $id
 * @property string $experience_id
 * @property string $experience_type
 * @property string $user_skill_id
 * @property string $details
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 * @property ?Carbon $deleted_at
 */
class ExperienceSkill extends Model
{
    use HasRelationships;
    use SoftDeletes;

    protected $keyType = 'string';

    protected $table = 'experience_skill';

    /** @return MorphTo<Experience, $this> */
    public function experience(): MorphTo
    {
        /** @var MorphTo<Experience, $this> */
        return $this->morphTo('experience');
    }

    /** @return BelongsTo<UserSkill, $this> */
    public function userSkill(): BelongsTo
    {
        return $this->belongsTo(UserSkill::class);
    }

    public function skill(): HasOneDeep
    {
        return $this->hasOneDeepFromRelations($this->userSkill(), (new UserSkill())->skill());
    }
}
