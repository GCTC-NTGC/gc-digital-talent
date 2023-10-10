<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class PoolSkill
 *
 * @property string $id
 * @property string $pool_id
 * @property string $skill_id
 * @property string $type
 */
class PoolSkill extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pool_skill';

    protected $keyType = 'string';

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }

    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    public function assessmentSteps(): BelongsToMany
    {
        return $this->belongsToMany(AssessmentStep::class, 'assessment_step_pool_skill')
            ->withTimestamps();
    }
}
