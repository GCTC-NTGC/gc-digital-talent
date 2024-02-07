<?php

namespace App\Models;

use App\Enums\AssessmentStepType;
use App\Enums\PoolSkillType;
use App\Enums\PoolStatus;
use App\Enums\SkillCategory;
use App\GraphQL\Validators\PoolIsCompleteValidator;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
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
 * @property array $advertisement_location
 * @property array $special_note
 * @property string $security_clearance
 * @property string $advertisement_language
 * @property string $stream
 * @property string $process_number
 * @property string $publishing_group
 * @property string $team_id
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $closing_date
 * @property Illuminate\Support\Carbon $published_at
 * @property Illuminate\Support\Carbon $archived_at
 */
class Pool extends Model
{
    use HasFactory;
    use LogsActivity;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
        'operational_requirements' => 'array',
        'key_tasks' => 'array',
        'advertisement_location' => 'array',
        'your_impact' => 'array',
        'what_to_expect' => 'array',
        'special_note' => 'array',
        'closing_date' => 'datetime',
        'published_at' => 'datetime',
        'is_remote' => 'boolean',
        'archived_at' => 'datetime',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [
        'is_remote',
        'closing_date',
        'published_at',
        'name',
        'key_tasks',
        'stream',
        'security_clearance',
        'advertisement_language',
        'your_impact',
        'what_to_expect',
        'advertisement_location',
        'special_note',
        'publishing_group',
        'process_number',
        'operational_requirements',
        'archived_at',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function user(): BelongsTo
    {
        // avoid selecting searchable column from user table
        // avoid selecting searchable column from user table
        return $this->belongsTo(User::class)
            ->select(['id',
                'email',
                'first_name',
                'last_name',
                'telephone',
                'preferred_lang',
                'current_province',
                'current_city',
                'looking_for_english',
                'looking_for_french',
                'looking_for_bilingual',
                'bilingual_evaluation',
                'comprehension_level',
                'written_level',
                'verbal_level',
                'estimated_language_ability',
                'is_gov_employee',
                'has_priority_entitlement',
                'priority_number',
                'department',
                'current_classification',
                'citizenship',
                'armed_forces_status',
                'is_woman',
                'has_disability',
                'is_visible_minority',
                'has_diploma',
                'location_preferences',
                'location_exemptions',
                'position_duration',
                'accepted_operational_requirements',
                'gov_employee_type',
                'priority_weight',
                'indigenous_declaration_signature',
                'indigenous_communities',
                'preferred_language_for_interview',
                'preferred_language_for_exam']);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class);
    }

    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class);
    }

    public function publishedPoolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class)->notDraft();
    }

    public function essentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'pool_skill')
            ->withTrashed() // pool-skills always fetches soft-deleted skill models
            ->withTimestamps()
            ->wherePivot('type', PoolSkillType::ESSENTIAL->name);
    }

    public function nonessentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'pool_skill')
            ->withTrashed()
            ->withTimestamps()
            ->wherePivot('type', PoolSkillType::NONESSENTIAL->name);
    }

    public function poolSkills(): HasMany
    {
        return $this->hasMany(PoolSkill::class);
    }

    public function assessmentSteps(): HasMany
    {
        return $this->hasMany(AssessmentStep::class);
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
    private function syncApplicationScreeningStepPoolSkills()
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

    public function generalQuestions(): HasMany
    {
        return $this->hasMany(GeneralQuestion::class)->select(['id', 'question', 'pool_id', 'sort_order']);
    }

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

        if (Carbon::now()->gte($this->archived_at)) {
            return PoolStatus::ARCHIVED->name;
        }
        if (Carbon::now()->gte($this->closing_date)) {
            return PoolStatus::CLOSED->name;
        }
        if (Carbon::now()->gte($this->published_at)) {
            return PoolStatus::PUBLISHED->name;
        }

        return PoolStatus::DRAFT->name;
    }

    // is the pool considered "complete", filled out entirely by the pool operator
    public function getIsCompleteAttribute()
    {
        $pool = $this->load(['classifications', 'essentialSkills']);

        $poolCompleteValidation = new PoolIsCompleteValidator;
        $validator = Validator::make($pool->toArray(),
            $poolCompleteValidation->rules(),
            $poolCompleteValidation->messages()
        );

        if ($validator->fails()) {
            return false;
        }

        return true;
    }

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
        });
    }

    public function scopeWasPublished(Builder $query, ?array $args)
    {
        $query->where('published_at', '<=', Carbon::now()->toDateTimeString());

        return $query;
    }

    public static function scopeCurrentlyActive(Builder $query)
    {
        $query->where('published_at', '<=', Carbon::now()->toDateTimeString())
            ->where('closing_date', '>', Carbon::now()->toDateTimeString());

        return $query;
    }

    public function scopeAuthorizedToView(Builder $query)
    {
        $user = Auth::user();

        if (! $user) {
            return $query->where('published_at', '<=', Carbon::now()->toDateTimeString());
        }

        if (! $user->isAbleTo('view-any-pool')) {
            $query->where(function (Builder $query) use ($user) {

                if ($user->isAbleTo('view-team-pool')) {
                    // Only add teams the user can view pools in to the query for `whereHAs`
                    $teams = $user->rolesTeams()->get();
                    $teamIds = [];
                    foreach ($teams as $team) {
                        if ($user->isAbleTo('view-team-pool', $team)) {
                            $teamIds[] = $team->id;
                        }
                    }

                    $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                        return $query->whereIn('id', $teamIds);
                    });
                }

                if ($user->isAbleTo('view-any-publishedPool')) {
                    $query->orWhere('published_at', '<=', Carbon::now()->toDateTimeString());
                }

                return $query;
            });
        }

        return $query;
    }

    public function scopeNotArchived(Builder $query)
    {
        $query->where(function ($query) {
            $query->whereNull('archived_at');
            $query->orWhere('archived_at', '>', Carbon::now()->toDateTimeString());
        });

        return $query;
    }
}
