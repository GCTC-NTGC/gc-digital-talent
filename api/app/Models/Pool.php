<?php

namespace App\Models;

use App\Builders\PoolBuilder;
use App\Casts\LocalizedString;
use App\Enums\ActivityEvent;
use App\Enums\ActivityLog;
use App\Enums\AssessmentStepType;
use App\Enums\PoolSkillType;
use App\Enums\PoolStatus;
use App\Enums\PublishingGroup;
use App\Enums\SkillCategory;
use App\GraphQL\Validators\AssessmentPlanIsCompleteValidator;
use App\Observers\PoolObserver;
use App\Traits\LogsCustomActivity;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class Pool
 *
 * @property string $id
 * @property array $name
 * @property int $user_id
 * @property array $operational_requirements
 * @property array $key_tasks
 * @property array $your_impact
 * @property array $what_to_expect
 * @property array $what_to_expect_admission
 * @property array $about_us
 * @property array $advertisement_location
 * @property array $special_note
 * @property ?string $security_clearance
 * @property ?string $advertisement_language
 * @property ?string $stream
 * @property ?string $process_number
 * @property ?string $publishing_group
 * @property ?string $opportunity_length
 * @property ?string $closing_reason
 * @property ?string $change_justification
 * @property ?string $status
 * @property string $department_id
 * @property string $community_id
 * @property string $work_stream_id
 * @property ?string $area_of_selection
 * @property array $selection_limitations
 * @property bool $is_remote
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $closing_date
 * @property ?\Illuminate\Support\Carbon $published_at
 * @property ?\Illuminate\Support\Carbon $archived_at
 * @property Classification $classification
 * @property ?string $contact_email
 */
class Pool extends Model
{
    use HasFactory;
    use LogsActivity;
    use LogsCustomActivity;
    use SoftDeletes;

    protected $keyType = 'string';

    protected $customLogName = ActivityLog::PROCESS->value;

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'name' => LocalizedString::class,
        'operational_requirements' => 'array',
        'key_tasks' => LocalizedString::class,
        'advertisement_location' => LocalizedString::class,
        'your_impact' => LocalizedString::class,
        'what_to_expect' => LocalizedString::class,
        'special_note' => LocalizedString::class,
        'what_to_expect_admission' => LocalizedString::class,
        'about_us' => LocalizedString::class,
        'closing_date' => 'datetime',
        'published_at' => 'datetime',
        'is_remote' => 'boolean',
        'archived_at' => 'datetime',
        'selection_limitations' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'is_remote',
        'closing_date',
        'published_at',
        'name',
        'key_tasks',
        'security_clearance',
        'advertisement_language',
        'your_impact',
        'what_to_expect',
        'advertisement_location',
        'special_note',
        'publishing_group',
        'process_number',
        'operational_requirements',
        'closing_reason',
        'archived_at',
        'contact_email',
    ];

    protected $completenessRequirements = [
        'fields' => [
            'name',
            'opportunity_length',
            'closing_date',
            'advertisement_language',
            'security_clearance',
            'publishing_group',
            'area_of_selection',
            'contact_email',
            'key_tasks',
            'your_impact',
            'classification_id',
            'department_id',
            'work_stream_id',
        ],

        'booleans' => [
            'is_remote',
        ],

        'bilingual' => [
            'name',
            'your_impact',
            'key_tasks',
            'advertisement_location',
            'special_note',
            'about_us',
            'what_to_expect_admission',
        ],
    ];

    /**
     * Boot function for using with User Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function (Pool $pool) {
            $pool->assessmentSteps()->create([
                'type' => AssessmentStepType::APPLICATION_SCREENING->name,
                'sort_order' => 1,
            ]);
            $pool->team()->firstOrCreate([], [
                'name' => 'pool-'.$pool->id,
            ]);

        });
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        Pool::observe(PoolObserver::class);
    }

    /**
     * Binds the eloquent builder to the model to allow for
     * applying scopes directly to Pool query builders
     *
     * i.e Pool::query()->wherePublished();
     */
    public function newEloquentBuilder($query): Builder
    {
        return new PoolBuilder($query);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function poolBookmarks(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pool_user_bookmarks', 'pool_id', 'user_id')->withTimestamps();
    }

    /** @return MorphOne<Team, $this> */
    public function team(): MorphOne
    {
        return $this->morphOne(Team::class, 'teamable');
    }

    /**
     * Get the department that owns the pool.
     *
     * @return BelongsTo<Department, $this>
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /** @return HasManyThrough<RoleAssignment, Team, $this> */
    public function roleAssignments(): HasManyThrough
    {
        // I think this only works because we use UUIDs
        // There might be a better way to do this
        return $this->hasManyThrough(RoleAssignment::class, Team::class, 'teamable_id');
    }

    /** @return BelongsTo<Classification, $this> */
    public function classification(): BelongsTo
    {
        return $this->belongsTo(Classification::class);
    }

    /** @return BelongsTo<WorkStream, $this> */
    public function workStream(): BelongsTo
    {
        return $this->belongsTo(WorkStream::class);
    }

    /** @return HasMany<PoolCandidate, $this> */
    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class);
    }

    /** @return HasMany<PoolCandidate, $this> */
    public function publishedPoolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class)->whereNotDraft();
    }

    /** @return BelongsToMany<Skill, $this> */
    public function essentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'pool_skill')
            ->withTrashed() // pool-skills always fetches soft-deleted skill models
            ->withTimestamps()
            ->wherePivot('type', PoolSkillType::ESSENTIAL->name);
    }

    /** @return BelongsToMany<Skill, $this> */
    public function nonessentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'pool_skill')
            ->withTrashed()
            ->withTimestamps()
            ->wherePivot('type', PoolSkillType::NONESSENTIAL->name);
    }

    /** @return HasMany<PoolSkill, $this> */
    public function poolSkills(): HasMany
    {
        return $this->hasMany(PoolSkill::class);
    }

    /** @return HasMany<AssessmentStep, $this> */
    public function assessmentSteps(): HasMany
    {
        return $this->hasMany(AssessmentStep::class)->orderBy('sort_order', 'ASC');
    }

    public function aggregateActivities($root, array $args = [])
    {
        return Activity::whereIsAggregatePoolActivity($args, $root);
    }

    /**
     * Attach the users to the related team creating one if there isn't already
     *
     * @param  string|array  $userId  - Id of the user or users to attach the role to
     * @return void
     */
    public function addProcessOperators(string|array $userId)
    {
        $team = $this->team()->firstOrCreate([], [
            'name' => 'pool-'.$this->id,
        ]);

        if (is_array($userId)) {
            foreach ($userId as $singleUserId) {
                $user = User::find($singleUserId);
                $user->addRole('process_operator', $team->name);
            }
        } else {
            $user = User::find($userId);
            $user->addRole('process_operator', $team->name);
        }
    }

    /**
     * Sync the essential skills in pool_skill
     *
     * @param  $skillIds  - array of skill ids
     * @return void
     */
    public function setEssentialPoolSkills($skillIds)
    {
        $skillArrayToSync = [];
        foreach ($skillIds as $skill) {
            $skillArrayToSync[$skill] = ['type' => PoolSkillType::ESSENTIAL->name];
        }

        $this->essentialSkills()->sync($skillArrayToSync);
        $this->syncApplicationScreeningStepPoolSkills();
    }

    /**
     * Sync the nonessential skills in pool_skill
     *
     * @param  $skillIds  - array of skill ids
     * @return void
     */
    public function setNonessentialPoolSkills($skillIds)
    {
        $skillArrayToSync = [];
        foreach ($skillIds as $skill) {
            $skillArrayToSync[$skill] = ['type' => PoolSkillType::NONESSENTIAL->name];
        }

        $this->nonessentialSkills()->sync($skillArrayToSync);
        $this->syncApplicationScreeningStepPoolSkills();
    }

    // Sync the APPLICATION_SCREENING assessment step with the pools technical skills
    public function syncApplicationScreeningStepPoolSkills()
    {
        $screeningStep = $this->assessmentSteps()->firstOrCreate([
            'type' => AssessmentStepType::APPLICATION_SCREENING->name,
            'sort_order' => 1,
        ]);

        $technicalSkills = $this->poolSkills()->get()->filter(function (PoolSkill $poolSkill) {
            $poolSkill->load('skill');

            return $poolSkill->skill->category === SkillCategory::TECHNICAL->name;
        });

        $screeningStep->poolSkills()->sync($technicalSkills);
    }

    /** @returns HasMany<GeneralQuestion, $this> */
    public function generalQuestions(): HasMany
    {
        return $this->hasMany(GeneralQuestion::class)->select(['id', 'question', 'pool_id', 'sort_order']);
    }

    /** @returns HasMany<ScreeningQuestion, $this> */
    public function screeningQuestions(): HasMany
    {
        return $this->hasMany(ScreeningQuestion::class);
    }

    /* accessor to obtain Status, depends on two variables regarding published and expiry */
    public function getStatusAttribute()
    {
        // override if no publish date
        if (is_null($this->published_at)) {
            return PoolStatus::DRAFT->name;
        }

        if ($this->archived_at && Carbon::now()->gte($this->archived_at)) {
            return PoolStatus::ARCHIVED->name;
        }
        if ($this->closing_date && Carbon::now()->gte($this->closing_date)) {
            return PoolStatus::CLOSED->name;
        }
        if ($this->published_at && Carbon::now()->gte($this->published_at)) {
            return PoolStatus::PUBLISHED->name;
        }

        return PoolStatus::DRAFT->name;
    }

    // is the assessment plan for the pool considered "complete"
    public function getAssessmentPlanIsCompleteAttribute()
    {
        $pool = $this->load(['assessmentSteps', 'poolSkills']);

        $planCompletionValidation = new AssessmentPlanIsCompleteValidator;
        $validator = Validator::make($pool->toArray(),
            $planCompletionValidation->rules(),
            $planCompletionValidation->messages()
        );

        if ($validator->fails()) {
            return false;
        }

        return true;
    }

    /* accessor to retrieve id from teams table */
    public function getTeamIdForRoleAssignmentAttribute()
    {
        return $this->team?->id;
    }

    /**
     * Get the display name (normal variant) for the model.
     */
    protected function displayName(): Attribute
    {
        return Attribute::make(
            get: function ($_, $attributes) {
                $locale = app()->getLocale();
                $this->loadMissing(['classification']);
                $definitions = [];
                if ($definition = $this->classification->getDefinition()) {
                    $definitions = [$definition];
                }

                return [
                    'display' => [
                        'en' => $this->formatDisplayName($attributes, 'en', false),
                        'fr' => $this->formatDisplayName($attributes, 'fr', false),
                        'localized' => $this->formatDisplayName($attributes, $locale, false),
                    ],
                    'definitions' => $definitions,
                ];
            }
        );
    }

    /**
     * Get the display name (full variant) for the model.
     */
    protected function fullDisplayName(): Attribute
    {
        return Attribute::make(
            get: function ($_, $attributes) {
                $locale = app()->getLocale();
                $this->loadMissing(['classification']);
                $definitions = [];
                if ($definition = $this->classification->getDefinition()) {
                    $definitions = [$definition];
                }

                return [
                    'display' => [
                        'en' => $this->formatDisplayName($attributes, 'en', true),
                        'fr' => $this->formatDisplayName($attributes, 'fr', true),
                        'localized' => $this->formatDisplayName($attributes, $locale, true),
                    ],
                    'definitions' => $definitions,
                ];
            }
        );
    }

    /**
     * Format the display name string.
     */
    protected function formatDisplayName(array $attributes, $locale, bool $full = false): string
    {
        $name = $this->name[$locale] ?? '';
        $publishingGroup = $attributes['publishing_group'] ?? null;

        if ($publishingGroup === PublishingGroup::IAP->name) {
            return $name;
        }

        $classification = $this->classification->formattedGroupAndLevel ?? '';

        if ($full) {
            $this->loadMissing(['workStream']);
            $stream = $this->workStream?->name[$locale] ?? '';
            $append = match (true) {
                $stream && $classification => " ($classification $stream)",
                (bool) $classification => " ($classification)",
                (bool) $stream => " ($stream)",
                default => '',
            };

            return $name.$append;
        }

        $dividingColon = Lang::get('common.dividing_colon', [], $locale);

        return $classification
            ? $classification.$dividingColon.$name
            : $name;
    }

    public function publish()
    {
        $this->disableCustomLogging(function ($pool) {
            $pool->update(['published_at' => Carbon::now()]);
        });

        $this->logActivity(ActivityEvent::PUBLISHED);
    }

    // is the pool considered "complete"
    public function isComplete(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->passesAllCompletenessChecks()
        );
    }

    /**
     * Check completeness of all required fields
     */
    protected function passesAllCompletenessChecks(): bool
    {
        return $this->hasAllRequiredFields()
            && $this->hasAllRequiredBooleans()
            && $this->hasCompleteBilingualFields()
            && $this->hasEssentialSkills()
            && $this->hasPoolSkillLevels()
            && $this->hasRequiredLocation();
    }

    protected function hasAllRequiredFields(): bool
    {
        foreach ($this->completenessRequirements['fields'] as $field) {
            if (blank($this->{$field})) {
                return false;
            }
        }

        return true;
    }

    protected function hasAllRequiredBooleans(): bool
    {
        foreach ($this->completenessRequirements['booleans'] as $field) {
            if (! array_key_exists($field, $this->attributes)) {
                return false;
            }
        }

        return true;
    }

    protected function hasCompleteBilingualFields(): bool
    {
        foreach ($this->completenessRequirements['bilingual'] as $field) {
            $value = $this->{$field};

            if (! is_array($value)) {
                continue;
            }

            if (
                (empty($value['en']) && ! empty($value['fr'])) ||
                (! empty($value['en']) && empty($value['fr']))
            ) {
                return false;
            }
        }

        return true;
    }

    protected function hasEssentialSkills(): bool
    {
        return $this->essentialSkills->isNotEmpty();
    }

    protected function hasPoolSkillLevels(): bool
    {
        return $this->poolSkills->every(
            fn ($skill) => filled($skill->required_skill_level)
        );
    }

    protected function hasRequiredLocation(): bool
    {
        return $this->is_remote || filled($this->advertisement_location);
    }
}
