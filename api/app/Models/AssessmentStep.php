<?php

namespace App\Models;

use App\Casts\LocalizedString;
use App\Enums\AssessmentStepType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class AssessmentStep
 *
 * @property string $id
 * @property string $pool_id
 * @property string $type
 * @property int $sort_order
 * @property array $title
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class AssessmentStep extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'title' => LocalizedString::class,
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'pool_id',
        'type',
        'sort_order',
        'title',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly((['*']))
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /** @return BelongsTo<Pool, $this> */
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    /** @return BelongsToMany<PoolSkill, $this> */
    public function poolSkills(): BelongsToMany
    {
        return $this->belongsToMany(PoolSkill::class, 'assessment_step_pool_skill')
            ->withTimestamps();
    }

    /** @return HasMany<AssessmentResult, $this> */
    public function assessmentResults(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }

    /** @return HasMany<ScreeningQuestion, $this> */
    public function screeningQuestions(): HasMany
    {
        return $this->hasMany(ScreeningQuestion::class);
    }

    /**
     * Boot function for using with AssessmentStep Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function (AssessmentStep $step) {
            if (isset($step['type']) && $step['type'] === AssessmentStepType::APPLICATION_SCREENING->name) {
                $sortOrder = 1;
            } elseif (isset($step['type']) && $step['type'] === AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name) {
                $sortOrder = 2;
            } else {
                $highestSortOrderStep = AssessmentStep::where('pool_id', $step['pool_id'])->orderBy('sort_order', 'desc')->first();
                $highestSortOrder = isset($highestSortOrderStep) ? $highestSortOrderStep->sort_order : 0;
                if ($highestSortOrder < 3) {
                    $sortOrder = 3;
                } else {
                    $sortOrder = $highestSortOrder + 1;
                }
            }
            $step['sort_order'] = $sortOrder;
        });

        static::deleted(function (AssessmentStep $step) {
            // If this was the screening question step delete all screening questions as well
            if (isset($step['type']) && $step['type'] === AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name) {
                $questions = ScreeningQuestion::where('pool_id', '=', $step->pool_id)->get();
                foreach ($questions as $question) {
                    $question->delete();
                }
            }
        });
    }
}
