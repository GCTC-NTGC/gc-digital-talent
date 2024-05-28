<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class PoolSkill
 *
 * @property string $id
 * @property string $pool_id
 * @property string $skill_id
 * @property string $type
 * @property string $required_skill_level
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

    protected $fillable = ['skill_id', 'type', 'required_skill_level'];

    protected static function boot()
    {
        parent::boot();

        static::created(function (PoolSkill $poolSkill) {
            $poolSkill->pool->syncApplicationScreeningStepPoolSkills();
        });

        static::deleted(function (PoolSkill $poolSkill) {
            $poolSkill->pool->syncApplicationScreeningStepPoolSkills();
        });
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class)->withTrashed();
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

    public function assessmentResults(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }
}
