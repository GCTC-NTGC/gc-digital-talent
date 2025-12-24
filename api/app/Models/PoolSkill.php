<?php

namespace App\Models;

use App\Enums\ActivityEvent;
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

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pool_skill';

    protected $keyType = 'string';

    protected $fillable = ['pool_id', 'skill_id', 'type', 'required_skill_level'];

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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['pool_id', 'skill_id', 'skill.name', 'skill.category', 'type', 'required_skill_level'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function tapActivity(Activity $activity, string $eventName)
    {
        $newEvent = match ($eventName) {
            'created' => ActivityEvent::ADDED->value,
            'deleted' => ActivityEvent::REMOVED->value,
            // NOTE: Oddly $eventName is uppercase
            default => is_string($eventName) ? strtolower($eventName) : $eventName,
        };

        $activity->event = $newEvent;
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
