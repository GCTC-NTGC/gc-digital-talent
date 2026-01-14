<?php

namespace App\Models;

use App\Casts\LocalizedString;
use App\Enums\ActivityEvent;
use App\Enums\ActivityLog;
use App\Enums\AssessmentStepType;
use App\Traits\LogsCustomActivity;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
 * @property ?array $name
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class AssessmentStep extends Model
{
    use HasFactory;
    use LogsActivity;
    use LogsCustomActivity;

    protected $keyType = 'string';

    protected $customLogName = ActivityLog::PROCESS->value;

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

    protected function customizeActivityProperties(array &$properties, ActivityEvent $event): void
    {
        $properties['attributes']['name'] = $this->name;
    }

    /** @return BelongsTo<Pool, $this> */
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    /** @return BelongsToMany<PoolSkill, $this, AssessmentStepPoolSkill> */
    public function poolSkills(): BelongsToMany
    {
        return $this->belongsToMany(PoolSkill::class, 'assessment_step_pool_skill')
            ->using(AssessmentStepPoolSkill::class)
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

    public function name(): Attribute
    {
        return Attribute::get(function () {
            $title = $this->title ?? [];
            $type = $this->type ? AssessmentStepType::localizedString($this->type) : ['en' => null, 'fr' => null];

            $titleEn = $title['en'] ?? null;
            $titleFr = $title['fr'] ?? null;
            $typeEn = $type['en'] ?? null;
            $typeFr = $type['fr'] ?? null;

            if (! empty($titleEn) || ! empty($titleFr)) {
                if ($typeEn || $typeFr) {
                    return [
                        'en' => $this->formatName($titleEn, $typeEn),
                        'fr' => $this->formatName($titleFr, $typeFr),
                    ];
                }

                return $title;
            }

            return $type;
        });
    }

    /**
     * Formats the name from title and type.
     */
    private function formatName(?string $title, ?string $type): ?string
    {
        if ($title && $type) {
            return sprintf('%s (%s)', $title, $type);
        }

        return $title ?? $type ?? null;
    }

    /**
     * Boot function for using with AssessmentStep Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        $atts = ['pool_id', 'sort_order', 'type', 'title'];

        static::creating(function (AssessmentStep $step) {

            $poolsExistingSteps = AssessmentStep::where('pool_id', $step['pool_id'])->orderBy('sort_order', 'desc')->get();

            if (isset($step['type']) && $step['type'] === AssessmentStepType::APPLICATION_SCREENING->name) {
                $sortOrder = 1;
            } elseif (isset($step['type']) && $step['type'] === AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name) {
                if (! is_null($poolsExistingSteps->where('sort_order', 2)->first())) {
                    // a step is currently sitting in the second slot, push 'em all down first
                    foreach ($poolsExistingSteps as $existingStep) {
                        if ($existingStep->sort_order !== 1) {
                            $current = $existingStep->sort_order;
                            $existingStep->sort_order = $current + 1;
                            $existingStep->save();
                        }
                    }
                }
                $sortOrder = 2;
            } else {
                $highestSortOrderStep = $poolsExistingSteps->first();
                $highestSortOrder = isset($highestSortOrderStep) ? $highestSortOrderStep->sort_order : 1; // step one should always be application screening
                $sortOrder = $highestSortOrder + 1;
            }
            $step['sort_order'] = $sortOrder;

        });

        static::created(function (AssessmentStep $step) use ($atts) {
            $step->logActivity(ActivityEvent::ADDED, $step->only($atts));
        });

        static::updated(function (AssessmentStep $step) use ($atts) {
            $step->logActivity(ActivityEvent::UPDATED, $step->only($atts));
        });

        static::deleted(function (AssessmentStep $step) use ($atts) {
            // If this was the screening question step delete all screening questions as well
            if (isset($step['type']) && $step['type'] === AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name) {
                $questions = ScreeningQuestion::where('pool_id', '=', $step->pool_id)->get();
                foreach ($questions as $question) {
                    $question->delete();
                }
            }
            // Then push steps up that came after the deleted
            $deletedStepSortValue = $step->sort_order;
            $poolsExistingSteps = AssessmentStep::where('pool_id', $step['pool_id'])->get();
            foreach ($poolsExistingSteps as $existingStep) {
                if ($existingStep->sort_order > $deletedStepSortValue) {
                    $current = $existingStep->sort_order;
                    $existingStep->sort_order = $current - 1;
                    $existingStep->save();
                }
            }

            $step->logActivity(ActivityEvent::REMOVED, $step->only($atts));
        });
    }
}
