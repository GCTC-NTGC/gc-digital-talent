<?php

namespace App\Models;

use App\Enums\ActivityEvent;
use App\Enums\ActivityLog;
use App\Traits\LogsCustomActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

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
    use LogsActivity;
    use LogsCustomActivity;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pool_skill';

    protected $keyType = 'string';

    protected $fillable = ['pool_id', 'skill_id', 'type', 'required_skill_level'];

    protected $customLogName = ActivityLog::PROCESS->value;

    protected static function boot()
    {
        parent::boot();

        $loggedAttributes = ['pool_id', 'type', 'required_skill_level'];

        static::created(function (PoolSkill $poolSkill) use ($loggedAttributes) {
            $poolSkill->pool->syncApplicationScreeningStepPoolSkills();
            $poolSkill->logActivity(ActivityEvent::ADDED, [
                ...$poolSkill->only($loggedAttributes),
                'skill' => $poolSkill->skill->name,
                'category' => $poolSkill->skill->category,
            ]);
        });

        static::updated(function (PoolSkill $poolSkill) use ($loggedAttributes) {
            $poolSkill->logActivity(ActivityEvent::UPDATED, [
                ...$poolSkill->only($loggedAttributes),
                'skill' => $poolSkill->skill->name,
                'category' => $poolSkill->skill->category,
            ]);
        });

        static::deleted(function (PoolSkill $poolSkill) use ($loggedAttributes) {
            $poolSkill->pool->syncApplicationScreeningStepPoolSkills();
            $poolSkill->logActivity(ActivityEvent::REMOVED, [
                ...$poolSkill->only($loggedAttributes),
                'skill' => $poolSkill->skill->name,
                'category' => $poolSkill->skill->category,
            ]);
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /** @return BelongsTo<Skill, $this> */
    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class)->withTrashed();
    }

    /** @return BelongsTo<Pool, $this> */
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    /** @return BelongsToMany<AssessmentStep, $this> */
    public function assessmentSteps(): BelongsToMany
    {
        return $this->belongsToMany(AssessmentStep::class, 'assessment_step_pool_skill')
            ->withTimestamps();
    }

    /** @return HasMany<AssessmentResult, $this> */
    public function assessmentResults(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }
}
