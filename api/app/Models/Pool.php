<?php

namespace App\Models;

use App\Builders\PoolBuilder;
use App\Enums\AssessmentStepType;
use App\Enums\PoolSkillType;
use App\Enums\PoolStatus;
use App\Enums\SkillCategory;
use App\GraphQL\Validators\AssessmentPlanIsCompleteValidator;
use App\GraphQL\Validators\PoolIsCompleteValidator;
use App\Observers\PoolObserver;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphOne;
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
 * @property array $what_to_expect_admission
 * @property array $about_us
 * @property array $advertisement_location
 * @property array $special_note
 * @property string $security_clearance
 * @property string $advertisement_language
 * @property string $stream
 * @property string $process_number
 * @property string $publishing_group
 * @property string $opportunity_length
 * @property string $closing_reason
 * @property string $change_justification
 * @property string $team_id
 * @property string $department_id
 * @property string $community_id
 * @property string $area_of_selection
 * @property array $selection_limitations
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
        'what_to_expect_admission' => 'array',
        'about_us' => 'array',
        'closing_date' => 'datetime',
        'published_at' => 'datetime',
        'is_remote' => 'boolean',
        'archived_at' => 'datetime',
        'selection_limitations' => 'array',
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
        'closing_reason',
        'archived_at',
    ];

    // expose the required columns to be accessed via relationship tables
    protected static $selectableColumns = [
        'id',
        'name',
        'user_id',
        'stream',
        'publishing_group',
        'published_at',
        'archived_at',
        'team_id',
        'closing_date',
        'is_remote',
        'key_tasks',
        'special_note',
        'advertisement_language',
        'classification_id',
        'closing_reason',
        'process_number',
        'department_id',
        'community_id',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        Pool::observe(PoolObserver::class);
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
            $pool->team()->firstOrCreate([], [
                'name' => 'pool-'.$pool->id,
            ]);
        });
    }

    public function newEloquentBuilder($query): PoolBuilder
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

    public function legacyTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function team(): MorphOne
    {
        return $this->morphOne(Team::class, 'teamable');
    }

    /**
     * Get the department that owns the pool.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    public function roleAssignments(): HasManyThrough
    {
        // I think this only works because we use UUIDs
        // There might be a better way to do this
        return $this->hasManyThrough(RoleAssignment::class, Team::class, 'teamable_id');
    }

    public function classification(): BelongsTo
    {
        return $this->belongsTo(Classification::class);
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
        return $this->hasMany(AssessmentStep::class)->orderBy('sort_order', 'ASC');
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
        $pool = $this->load(['classification', 'essentialSkills', 'nonessentialSkills', 'poolSkills']);

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
     * Filter for pools the user is allowed to admin, based on scopeAuthorizedToAdmin
     */
    public static function scopeCanAdmin(Builder $query, ?bool $canAdmin): void
    {
        if ($canAdmin) {
            $query->authorizedToAdmin();
        }
    }

    public static function scopeAuthorizedToAdmin(Builder $query): void
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        // if they can view any, then nothing filtered out
        if ($user?->isAbleTo('view-any-assessmentPlan')) {
            return;
        }

        // if they can view team plans, then filter by teams
        if ($user?->isAbleTo('view-team-assessmentPlan')) {
            $query->where(function (Builder $query) use ($user) {
                // Only add teams the user can view pools in to the query for `whereHas`
                $teams = $user->rolesTeams()->get();
                $teamIds = [];
                foreach ($teams as $team) {
                    if ($user->isAbleTo('view-team-assessmentPlan', $team)) {
                        $teamIds[] = $team->id;
                    }
                }

                $query->orWhereHas('legacyTeam', function (Builder $query) use ($teamIds) {
                    $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
            });

            return;
        }

        // the user can't see any assessment plans
        $query->where('id', null);
    }

    /**
     * Custom sort to handle issues with how laravel aliases
     * aggregate selects and orderBys for json fields in `lighthouse-php`
     *
     * The column used in the orderBy is `table_aggregate_column->property`
     * But is actually aliased to snake case `table_aggregate_columnproperty`
     */
    public function scopeOrderByTeamDisplayName(Builder $query, ?array $args): Builder
    {
        extract($args);

        if ($order && $locale) {
            $query = $query->withMax('legacyTeam', 'display_name->'.$locale)->orderBy('legacy_team_max_display_name'.$locale, $order);
        }

        return $query;

    }

    public function scopeOrderByPoolBookmarks(Builder $query, ?array $args): Builder
    {
        extract($args);

        /** @var \App\Models\User */
        $user = Auth::user();

        // order the pools so that the bookmarks connected to current user sticks to the top
        if ($order && $user) {
            $query->orderBy(
                $user->selectRaw('1')
                    ->join('pool_user_bookmarks', 'pool_user_bookmarks.user_id', '=', 'users.id')
                    ->where('pool_user_bookmarks.user_id', $user->id)
                    ->whereColumn('pool_user_bookmarks.pool_id', 'pools.id')
            );
        }

        return $query;
    }

    public function scopeAuthorizedToView(Builder $query): void
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        // can view any pool - return query with no filters added
        if ($user?->isAbleTo('view-any-pool')) {
            return;
        }

        // we might want to add some filters for some pools
        $filterCountBefore = count($query->getQuery()->wheres);
        $query->where(function (Builder $query) use ($user) {
            if ($user?->isAbleTo('view-team-draftPool')) {
                // Only add teams the user can view pools in to the query for `whereHas`
                $teams = $user->rolesTeams()->get();
                $teamIds = [];
                foreach ($teams as $team) {
                    if ($user->isAbleTo('view-team-draftPool', $team)) {
                        $teamIds[] = $team->id;
                    }
                }

                $query->orWhereHas('legacyTeam', function (Builder $query) use ($teamIds) {
                    $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
            }

            if ($user?->isAbleTo('view-any-publishedPool')) {
                $query->orWhere('published_at', '<=', Carbon::now()->toDateTimeString());
            }
        });
        $filterCountAfter = count($query->getQuery()->wheres); // will not increment if an empty "where" subquery above
        if ($filterCountAfter > $filterCountBefore) {
            return;
        }

        // fall through - anyone can view a published pool
        $query->where('published_at', '<=', Carbon::now()->toDateTimeString());
    }

    public static function getSelectableColumns()
    {
        return self::$selectableColumns;
    }
}
