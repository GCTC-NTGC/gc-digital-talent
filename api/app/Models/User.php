<?php

namespace App\Models;

use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateSuspendedFilter;
use App\Enums\EmailType;
use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PoolCandidateStatus;
use App\Enums\PositionDuration;
use App\Enums\PriorityWeight;
use App\Notifications\VerifyEmail;
use App\Observers\UserObserver;
use App\Traits\EnrichedNotifiable;
use App\Traits\HasLocalizedEnums;
use App\Traits\HydratesSnapshot;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laratrust\Contracts\LaratrustUser;
use Laratrust\Traits\HasRolesAndPermissions;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\CausesActivity;
use Spatie\Activitylog\Traits\LogsActivity;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class User
 *
 * @property string $id
 * @property ?string $email
 * @property ?\Illuminate\Support\Carbon $email_verified_at
 * @property string $sub
 * @property ?string $first_name
 * @property ?string $last_name
 * @property ?string $telephone
 * @property ?string $preferred_lang
 * @property ?string $current_province
 * @property ?string $current_city
 * @property ?bool $looking_for_english
 * @property ?bool $looking_for_french
 * @property ?bool $looking_for_bilingual
 * @property ?string $first_official_language
 * @property ?bool $second_language_exam_completed
 * @property ?bool $second_language_exam_validity
 * @property ?string $comprehension_level
 * @property ?string $written_level
 * @property ?string $verbal_level
 * @property ?string $estimated_language_ability
 * @property ?bool $computed_is_gov_employee
 * @property bool $isVerifiedGovEmployee
 * @property ?string $work_email
 * @property ?\Illuminate\Support\Carbon $work_email_verified_at
 * @property ?bool $has_priority_entitlement
 * @property ?string $priority_number
 * @property ?string $computed_department
 * @property ?string $computed_classification
 * @property ?string $citizenship
 * @property ?string $armed_forces_status
 * @property ?bool $is_woman
 * @property ?bool $has_disability
 * @property ?bool $is_visible_minority
 * @property ?bool $has_diploma
 * @property ?array $location_preferences
 * @property ?string $location_exemptions
 * @property ?array $position_duration
 * @property array $accepted_operational_requirements
 * @property ?string $computed_gov_employee_type
 * @property ?string $computed_gov_role
 * @property ?int $priority_weight
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $deleted_at
 * @property ?string $indigenous_declaration_signature
 * @property ?array $indigenous_communities
 * @property ?string $preferred_language_for_interview
 * @property ?string $preferred_language_for_exam
 * @property ?array $enabled_email_notifications
 * @property ?array $enabled_in_app_notifications
 * @property \App\Models\Notification $unreadNotifications
 * @property \Illuminate\Support\Collection<\App\Models\Notification> $notifications
 * @property ?string $off_platform_recruitment_processes
 * @property ?bool $is_verified_gov_employee
 *
 * @method Builder|static authorizedToView()
 * @method static Builder|static query()
 */
class User extends Model implements Authenticatable, HasLocalePreference, LaratrustUser
{
    use AuthenticatableTrait;
    use Authorizable;
    use CausesActivity;
    use EnrichedNotifiable;
    use HasFactory;
    use HasLocalizedEnums;
    use HasRelationships;
    use HasRolesAndPermissions {
        roles as baseRoles;
    }
    use HydratesSnapshot;
    use LogsActivity;
    use Searchable;
    use SoftDeletes;

    protected $keyType = 'string';

    protected $casts = [
        'location_preferences' => 'array',
        'accepted_operational_requirements' => 'array',
        'position_duration' => 'array',
        'indigenous_communities' => 'array',
        'enabled_email_notifications' => 'array',
        'enabled_in_app_notifications' => 'array',
    ];

    protected $fillable = [
        'email',
        'sub',
        'computed_is_gov_employee',
        'computed_gov_employee_type',
        'computed_classification',
        'computed_department',
        'computed_gov_position_type',
        'computed_gov_end_date',
        'computed_gov_role',
    ];

    protected $hidden = [];

    public function searchableOptions()
    {
        return [
            // You may want to store the index outside of the Model table
            // In that case let the engine know by setting this parameter to true.
            'external' => true,
            // If you don't want scout to maintain the index for you
            // You can turn it off either for a Model or globally
            'maintain_index' => true,
        ];
    }

    public function searchableAs(): string
    {
        return 'user_search_indices';
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing([
            'poolCandidates',
            'workExperiences',
            'educationExperiences',
            'personalExperiences',
            'communityExperiences',
            'awardExperiences',
        ]);

        $result = collect([
            $this->email, $this->first_name, $this->last_name, $this->telephone, $this->current_province, $this->current_city,
            $this->poolCandidates->pluck('notes'),
            $this->workExperiences->pluck('role'),
            $this->workExperiences->pluck('organization'),
            $this->workExperiences->pluck('division'),
            $this->workExperiences->pluck('details'),
            $this->educationExperiences->pluck('thesis_title'),
            $this->educationExperiences->pluck('institution'),
            $this->educationExperiences->pluck('details'),
            $this->educationExperiences->pluck('area_of_study'),
            $this->personalExperiences->pluck('title'),
            $this->personalExperiences->pluck('description'),
            $this->personalExperiences->pluck('details'),
            $this->communityExperiences->pluck('title'),
            $this->communityExperiences->pluck('organization'),
            $this->communityExperiences->pluck('project'),
            $this->communityExperiences->pluck('details'),
            $this->awardExperiences->pluck('title'),
            $this->awardExperiences->pluck('details'),
            $this->awardExperiences->pluck('issued_by'),
        ])
            ->flatten()
            ->reject(function ($value) {
                return is_null($value) || $value === '';
            })->toArray();

        if (! $result) {
            // SQL query doesn't handle empty arrays for some reason?
            $result = [' '];
        }

        return $result;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Extends Laratrust roles relationship to
     * support timestamp updating.
     */
    public function roles(): MorphToMany
    {
        return $this->baseRoles()->withTimestamps();
    }

    /**
     * Get the user's preferred locale.
     */
    public function preferredLocale(): string
    {
        return $this->preferred_lang ?? 'en';
    }

    /** @return HasMany<Pool, $this> */
    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }

    /** @return BelongsToMany<Pool, $this> */
    public function poolBookmarks(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pool_user_bookmarks', 'user_id', 'pool_id')->withTimestamps();
    }

    /** @return HasMany<PoolCandidate, $this> */
    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class)->withTrashed();
    }

    /** @return BelongsTo<Department, $this> */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'computed_department')
            ->select(['id', 'name', 'department_number']);
    }

    /** @return BelongsTo<Classification, $this> */
    public function currentClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'computed_classification');
    }

    /** @return HasMany<AwardExperience, $this> */
    public function awardExperiences(): HasMany
    {
        return $this->hasMany(AwardExperience::class);
    }

    /** @return HasMany<CommunityExperience, $this> */
    public function communityExperiences(): HasMany
    {
        return $this->hasMany(CommunityExperience::class);
    }

    /** @return HasMany<EducationExperience, $this> */
    public function educationExperiences(): HasMany
    {
        return $this->hasMany(EducationExperience::class);
    }

    /** @return HasMany<PersonalExperience, $this> */
    public function personalExperiences(): HasMany
    {
        return $this->hasMany(PersonalExperience::class);
    }

    /** @return HasMany<WorkExperience, $this> */
    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    /** @return HasMany<Experience, $this> */
    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    /** @return HasMany<RoleAssignment, $this> */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }

    /** @return HasMany<UserSkill, $this> */
    public function userSkills(): HasMany
    {
        return $this->hasMany(UserSkill::class, 'user_id');
    }

    public function skills(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->userSkills(), (new UserSkill)->skill());
    }

    // User 1-0..* PoolCandidateSearchRequest
    public function poolCandidateSearchRequests(): HasMany
    {
        return $this->hasMany(PoolCandidateSearchRequest::class);
    }

    public function employeeProfile(): HasOne
    {
        return $this->hasOne(EmployeeProfile::class, 'id');
    }

    // This method will add the specified skills to UserSkills if they don't exist yet.
    public function addSkills($skill_ids)
    {
        // If any of the skills already exist but are soft-deleted, restore them
        $this->userSkills()->withTrashed()->whereIn('skill_id', $skill_ids)->restore();
        // Create a basic UserSkill for any skills not yet related to this user.
        $existingSkillIds = $this->userSkills()->withTrashed()->pluck('skill_id');
        $newSkillIds = collect($skill_ids)->diff($existingSkillIds)->unique();
        foreach ($newSkillIds as $skillId) {
            $userSkill = new UserSkill;
            $userSkill->skill_id = $skillId;
            $this->userSkills()->save($userSkill);
        }
        // If this User instance continues to be used, ensure the in-memory instance has the updated skills.
        $this->refresh();
        $this->searchable();
    }

    public function getFullName(?bool $anonymous = false)
    {
        $lastName = $this->last_name;
        if ($anonymous && $lastName) {
            $lastName = substr($lastName, 0, 1);
        }

        if ($this->first_name && $lastName) {
            return $this->first_name.' '.$lastName;
        } elseif ($this->first_name) {
            return $this->first_name;
        } elseif ($lastName) {
            return $lastName;
        }

        return '';
    }

    public function wouldAcceptTemporary(): bool
    {
        return in_array(PositionDuration::TEMPORARY->name, $this->position_duration);
    }

    public function getClassification()
    {

        if (! $this->computed_classification) {
            return '';
        }

        $classification = $this->currentClassification;

        $leadingZero = $classification->level < 10 ? '0' : '';

        return $classification->group.'-'.$leadingZero.$classification->level;
    }

    public function getDepartment()
    {
        if (! $this->computed_department) {
            return '';
        }

        return $this->department()->get(['name']);
    }

    public function getPriorityAttribute()
    {
        if (is_null($this->priority_weight)) {
            return $this->priority_weight;
        }

        return match ($this->priority_weight) {
            10 => PriorityWeight::PRIORITY_ENTITLEMENT->name,
            20 => PriorityWeight::VETERAN->name,
            30 => PriorityWeight::CITIZEN_OR_PERMANENT_RESIDENT->name,
            default => PriorityWeight::OTHER->name
        };
    }

    public function getOperationalRequirements()
    {

        $operationalRequirements = array_column(OperationalRequirement::cases(), 'name');
        $preferences = [
            'accepted' => [],
            'not_accepted' => [],
        ];
        foreach ($operationalRequirements as $requirement) {
            if (in_array($requirement, $this->accepted_operational_requirements ?? [])) {
                $preferences['accepted'][] = $requirement;
            } else {
                $preferences['not_accepted'][] = $requirement;
            }
        }

        return $preferences;
    }

    protected function isVerifiedGovEmployee(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $attributes['computed_is_gov_employee'] && ! is_null($attributes['work_email']) && ! is_null($attributes['work_email_verified_at']),
        );
    }

    // getIsProfileCompleteAttribute function is correspondent to isProfileComplete attribute in graphql schema
    public function getIsProfileCompleteAttribute(): bool
    {
        if (
            is_null($this->attributes['first_name']) or
            is_null($this->attributes['last_name']) or
            is_null($this->attributes['email']) or
            is_null($this->attributes['telephone']) or
            is_null($this->attributes['preferred_lang']) or
            is_null($this->attributes['preferred_language_for_interview']) or
            is_null($this->attributes['preferred_language_for_exam']) or
            is_null($this->attributes['current_province']) or
            is_null($this->attributes['current_city']) or
            (is_null($this->attributes['looking_for_english']) &&
                is_null($this->attributes['looking_for_french']) &&
                is_null($this->attributes['looking_for_bilingual'])
            ) or
            is_null($this->attributes['computed_is_gov_employee']) or
            is_null($this->attributes['has_priority_entitlement']) or
            ($this->attributes['has_priority_entitlement'] && is_null($this->attributes['priority_number'])) or
            is_null($this->attributes['location_preferences']) or
            empty($this->attributes['location_preferences']) or
            empty($this->attributes['position_duration']) or
            is_null($this->attributes['citizenship']) or
            is_null($this->attributes['armed_forces_status'])
        ) {
            return false;
        } else {
            return true;
        }
    }

    public static function scopeIsProfileComplete(Builder $query, ?bool $isProfileComplete): Builder
    {
        if ($isProfileComplete) {
            $query->whereNotNull('first_name');
            $query->whereNotNull('last_name');
            $query->whereNotNull('email');
            $query->whereNotNull('telephone');
            $query->whereNotNull('preferred_lang');
            $query->whereNotNull('preferred_language_for_interview');
            $query->whereNotNull('preferred_language_for_exam');
            $query->whereNotNull('current_province');
            $query->whereNotNull('current_city');
            $query->where(function ($query) {
                $query->whereNotNull('looking_for_english');
                $query->orWhereNotNull('looking_for_french');
                $query->orWhereNotNull('looking_for_bilingual');
            });
            $query->whereNotNull('computed_is_gov_employee');
            $query->where(function (Builder $query) {
                $query->where('has_priority_entitlement', false)
                    ->orWhere(function (Builder $query) {
                        $query->where('has_priority_entitlement', true)
                            ->whereNotNull('priority_number');
                    });
            });
            $query->whereNotNull('location_preferences');
            $query->whereJsonLength('location_preferences', '>', 0);
            $query->whereJsonLength('position_duration', '>', 0);
            $query->whereNotNull('citizenship');
            $query->whereNotNull('armed_forces_status');
        }

        return $query;
    }

    /**
     * Custom logging for adding/removing roles for a user
     *
     * This comes from Laratrust so it is missed in the normal
     * event logging for this model. Since we do not have access to specific data
     * the shape is slightly different
     *
     *  - Subject is the user being affected (role added to or removed from)
     *  - Properties are the subject users id, role id and if it is a team based role, the team id
     *
     * @param  string  $eventName  The action taken `roleAdded` | `roleRemoved`
     * @param  User  $user  User being affected (subject)
     * @param  ?string  $roleId  Id of the role being added or removed
     * @param  mixed  $team  IF team based role, the ID or array of then team ID
     */
    private static function logRoleChange(string $eventName, User $user, ?string $roleId, mixed $team)
    {
        if (! $roleId) {
            return;
        }

        $properties = [
            'user_id' => $user->id,
            'role_id' => $roleId,
        ];
        if ($team) {
            $teamId = $team;
            if (is_array($team)) {
                if (Arr::isAssoc($team) && isset($team['id'])) {
                    $teamId = $team['id'];
                } elseif (isset($team[0]['id'])) {
                    $teamId = $team[0]['id'];
                }
            }

            $properties['team_id'] = $teamId;
        }

        activity()
            ->causedBy(Auth::user())
            ->performedOn($user)
            ->withProperties(['attributes' => $properties])
            ->event($eventName)
            ->log($eventName);
    }

    /**
     * Boot function for using with User Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();
        static::created(function (User $user) {
            $user->searchable();
        });
        static::deleting(function (User $user) {
            // We only need to run this if the user is being soft deleted
            if (! $user->isForceDeleting()) {
                // Cascade delete to child models
                $user->poolCandidates()->delete();

                // Modify the email(s) to allow use by another user
                $user->email = $user->email.'-deleted-at-'.Carbon::now()->format('Y-m-d');
                if (! is_null($user->work_email)) {
                    $user->work_email = $user->work_email.'-deleted-at-'.Carbon::now()->format('Y-m-d');
                }
                $user->save();
            }
            $user->searchable();
        });

        static::restoring(function (User $user) {
            // Cascade restore to child models
            foreach ($user->poolCandidates()->withTrashed()->get() as $candidate) {
                $candidate->restore();
            }

            $newContactEmail = $user->email.'-restored-at-'.Carbon::now()->format('Y-m-d');
            $user->update(['email' => $newContactEmail]);
            if (! is_null($user->work_email)) {
                $newWorkEmail = $user->work_email.'-restored-at-'.Carbon::now()->format('Y-m-d');
                $user->update(['email' => $newWorkEmail]);
            }
        });

        static::roleAdded(function (User $user, string $role, $team) {
            self::logRoleChange('roleAdded', $user, $role, $team);
        });

        static::roleRemoved(function (User $user, string $role, $team) {
            self::logRoleChange('roleRemoved', $user, $role, $team);
        });
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        User::observe(UserObserver::class);
    }

    // Search filters

    /**
     * Filters users by the Pools they are in.
     *
     * @param  array  $poolFilters  Each pool filter must contain a poolId, and may contain expiryStatus, statuses, and suspendedStatus fields
     */
    public static function scopePoolFilters(Builder $query, ?array $poolFilters): Builder
    {
        if (empty($poolFilters)) {
            return $query;
        }

        // Pool acts as an OR filter. The query should return valid candidates in ANY of the pools.
        $query->whereExists(function ($query) use ($poolFilters) {
            $query->select('id')
                ->from('pool_candidates')
                ->whereColumn('pool_candidates.user_id', 'users.id')
                ->where(function ($query) use ($poolFilters) {
                    $makePoolFilterClause = function ($filter) {
                        return function ($query) use ($filter) {
                            $query->where('pool_candidates.pool_id', $filter['poolId']);
                            $query->where(function ($query) use ($filter) {
                                if (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == CandidateExpiryFilter::ACTIVE->name) {
                                    $query->whereDate('expiry_date', '>=', date('Y-m-d'))
                                        ->orWhereNull('expiry_date');
                                } elseif (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == CandidateExpiryFilter::EXPIRED->name) {
                                    $query->whereDate('expiry_date', '<', date('Y-m-d'));
                                }
                            });
                            if (array_key_exists('statuses', $filter) && ! empty($filter['statuses'])) {
                                $query->whereIn('pool_candidates.pool_candidate_status', $filter['statuses']);
                            }
                            $query->where(function ($query) use ($filter) {
                                if (array_key_exists('suspendedStatus', $filter) && $filter['suspendedStatus'] == CandidateSuspendedFilter::ACTIVE->name) {
                                    $query->where('suspended_at', '>=', Carbon::now())
                                        ->orWhereNull('suspended_at');
                                } elseif (array_key_exists('suspendedStatus', $filter) && $filter['suspendedStatus'] == CandidateSuspendedFilter::SUSPENDED->name) {
                                    $query->where('suspended_at', '<', Carbon::now());
                                }
                            });

                            return $query;
                        };
                    };
                    foreach ($poolFilters as $index => $filter) {
                        if ($index == 0) {
                            $query->where($makePoolFilterClause($filter));
                        } else {
                            $query->orWhere($makePoolFilterClause($filter));
                        }
                    }

                    return $query;
                });
        });

        return $query;
    }

    /**
     * Return applicants with PoolCandidates in any of the given pools.
     * Only consider pool candidates who are available,
     * ie not expired, with the AVAILABLE status, and the application is not suspended
     */
    public static function scopeAvailableInPools(Builder $query, ?array $poolIds): Builder
    {
        if (empty($poolIds)) {
            return $query;
        }
        $poolFilters = [];
        foreach ($poolIds as $index => $poolId) {
            $poolFilters[$index] = [
                'poolId' => $poolId,
                'expiryStatus' => CandidateExpiryFilter::ACTIVE->name,
                'statuses' => PoolCandidateStatus::qualifiedEquivalentGroup(),
                'suspendedStatus' => CandidateSuspendedFilter::ACTIVE->name,
            ];
        }

        return self::scopePoolFilters($query, $poolFilters);
    }

    public static function scopeLanguageAbility(Builder $query, ?string $languageAbility): Builder
    {
        if (empty($languageAbility)) {
            return $query;
        }

        // $languageAbility comes from enum LanguageAbility
        // filtering on fields looking_for_<english/french/bilingual>
        if ($languageAbility == LanguageAbility::ENGLISH->name) {
            $query->where('looking_for_english', true);
        }
        if ($languageAbility == LanguageAbility::FRENCH->name) {
            $query->where('looking_for_french', true);
        }
        if ($languageAbility == LanguageAbility::BILINGUAL->name) {
            $query->where('looking_for_bilingual', true);
        }

        return $query;
    }

    public static function scopeOperationalRequirements(Builder $query, ?array $operationalRequirements): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($operationalRequirements)) {
            return $query;
        }

        // OperationalRequirements act as an AND filter. The query should only return candidates willing to accept ALL of the requirements.
        $query->whereJsonContains('accepted_operational_requirements', $operationalRequirements);

        return $query;
    }

    public static function scopeLocationPreferences(Builder $query, ?array $workRegions): Builder
    {
        if (empty($workRegions)) {
            return $query;
        }
        // LocationPreferences acts as an OR filter. The query should return candidates willing to work in ANY of the workRegions.
        $query->where(function ($query) use ($workRegions) {
            foreach ($workRegions as $index => $workRegion) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere
                    $query->whereJsonContains('location_preferences', $workRegion);
                } else {
                    $query->orWhereJsonContains('location_preferences', $workRegion);
                }
            }
        });

        return $query;
    }

    /**
     * Skills filtering
     */
    public static function scopeSkillsIntersectional(Builder $query, ?array $skill_ids): Builder
    {
        if (empty($skill_ids)) {
            return $query;
        }

        // skills AND filtering. The query should only return candidates with ALL of the skills.
        foreach ($skill_ids as $skill_id) {
            $query->whereExists(function ($query) use ($skill_id) {
                $query->select(DB::raw('null'))
                    ->from('user_skills')
                    ->whereColumn('user_skills.user_id', 'users.id')
                    ->where('user_skills.skill_id', $skill_id);
            });
        }

        return $query;
    }

    public static function scopeSkillsAdditive(Builder $query, ?array $skill_ids): Builder
    {
        if (empty($skill_ids)) {
            return $query;
        }

        // skills OR filtering. The query should return candidates with ANY of the skills.
        $query->whereExists(function ($query) use ($skill_ids) {
            $query->select(DB::raw('null'))
                ->from('user_skills')
                ->whereColumn('user_skills.user_id', 'users.id')
                ->whereIn('user_skills.skill_id', $skill_ids);
        });

        return $query;
    }

    /**
     * Scopes the query to only return users in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param  array|null  $classifications  Each classification is an object with a group and a level field.
     */
    public static function scopeAppliedClassifications(Builder $query, ?array $classifications): Builder
    {
        if (empty($classifications)) {
            return $query;
        }
        $query->whereHas('poolCandidates', function ($query) use ($classifications) {
            PoolCandidate::scopeAppliedClassifications($query, $classifications);
        });

        return $query;
    }

    /**
     * Scopes the query to only return users who are available in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param  array|null  $classifications  Each classification is an object with a group and a level field.
     */
    public static function scopeQualifiedClassifications(Builder $query, ?array $classifications): Builder
    {
        if (empty($classifications)) {
            return $query;
        }
        $query->whereHas('poolCandidates', function ($query) use ($classifications) {
            PoolCandidate::scopeQualifiedClassifications($query, $classifications);
        });

        return $query;
    }

    /**
     * Scopes the query to only return users who are available in a pool with one of the specified streams.
     * If $streams is empty, this scope will be ignored.
     */
    public static function scopeQualifiedStreams(Builder $query, ?array $streams): Builder
    {
        if (empty($streams)) {
            return $query;
        }

        $query->whereHas('poolCandidates', function ($query) use ($streams) {
            PoolCandidate::scopeQualifiedStreams($query, $streams);
        });

        return $query;
    }

    /**
     * Scope Publishing Groups
     *
     * Restrict a query by specific publishing groups
     */
    public static function scopePublishingGroups(Builder $query, ?array $publishingGroups): Builder
    {
        // Early return if no publishing groups were supplied
        if (empty($publishingGroups)) {
            return $query;
        }

        $query = $query->whereHas('poolCandidates', function ($query) use ($publishingGroups) {
            return PoolCandidate::scopePublishingGroups($query, $publishingGroups);
        });

        return $query;
    }

    /**
     * Return users who have an available PoolCandidate in at least one IT pool.
     */
    public static function scopeTalentSearchablePublishingGroup(Builder $query, $args): Builder
    {

        return $query->whereHas('poolCandidates', function ($innerQueryBuilder) use ($args) {
            $filters = Arr::get($args ?? [], 'where', []);

            $innerQueryBuilder->whereHas('pool', function ($query) use ($filters) {
                $query->wherePublished();

                if (array_key_exists('qualifiedClassifications', $filters)) {
                    $query->whereClassifications($filters['qualifiedClassifications']);
                }

                if (array_key_exists('qualifiedStreams', $filters)) {
                    $query->whereWorkStreamsIn($filters['qualifiedStreams']);
                }
            });

            PoolCandidate::scopeAvailable($innerQueryBuilder);
            PoolCandidate::scopeInTalentSearchablePublishingGroup($innerQueryBuilder);

            return $innerQueryBuilder;
        });
    }

    /**
     * Return users who have a PoolCandidate in a given community
     */
    public static function scopeCandidatesInCommunity(Builder $query, ?string $communityId): Builder
    {
        if (empty($communityId)) {
            return $query;
        }

        $query = $query->whereHas('poolCandidates', function ($query) use ($communityId) {
            return PoolCandidate::scopeCandidatesInCommunity($query, $communityId);
        });

        return $query;
    }

    public static function scopeHasDiploma(Builder $query, ?bool $hasDiploma): Builder
    {
        if ($hasDiploma) {
            $query->where('has_diploma', true);
        }

        return $query;
    }

    public static function scopePositionDuration(Builder $query, ?array $positionDuration): Builder
    {
        if (empty($positionDuration)) {
            return $query;
        }

        $query->where(function ($query) use ($positionDuration) {
            foreach ($positionDuration as $index => $duration) {
                $query->orWhereJsonContains('position_duration', $duration);
            }
        });

        return $query;
    }

    public static function scopeEquity(Builder $query, ?array $equity): Builder
    {
        if (empty($equity)) {
            return $query;
        }

        // OR filter - first find out how many booleans are true, create array of all true equity booleans
        // equity object has 4 keys with associated booleans
        $equityVars = [];
        if (array_key_exists('is_woman', $equity) && $equity['is_woman']) {
            array_push($equityVars, 'is_woman');
        }
        if (array_key_exists('has_disability', $equity) && $equity['has_disability']) {
            array_push($equityVars, 'has_disability');
        }
        if (array_key_exists('is_indigenous', $equity) && $equity['is_indigenous']) {
            array_push($equityVars, 'is_indigenous');
        }
        if (array_key_exists('is_visible_minority', $equity) && $equity['is_visible_minority']) {
            array_push($equityVars, 'is_visible_minority');
        }

        // 3 fields are booleans, one is a jsonb field
        $query->where(function ($query) use ($equityVars) {
            foreach ($equityVars as $index => $equityInstance) {
                if ($equityInstance === 'is_indigenous') {
                    $query->orWhereJsonLength('indigenous_communities', '>', 0);
                } else {
                    $query->orWhere($equityVars[$index], true);
                }
            }
        });

        return $query;
    }

    public static function scopeNegationNameAndEmail(Builder $query, ?array $negationArray): Builder
    {
        if (isset($negationArray) && count($negationArray) > 0) {
            foreach ($negationArray as $index => $value) {
                $query->whereNot('first_name', 'ilike', $value);
                $query->whereNot('last_name', 'ilike', $value);
                $query->whereNot('email', 'ilike', $value);
            }
        }

        return $query;
    }

    public static function scopeGeneralSearch(Builder $query, ?string $searchTerm): Builder
    {
        if ($searchTerm) {
            $combinedSearchTerm = trim(preg_replace('/\s{2,}/', ' ', $searchTerm));

            $query
                ->join('user_search_indices', 'users.id', '=', 'user_search_indices.id')
                // attach the tsquery to every row to use for filtering
                ->crossJoinSub(function ($query) use ($combinedSearchTerm) {
                    $query->selectRaw(
                        'websearch_to_tsquery(coalesce(?, get_current_ts_config()), ?)'.' AS tsquery',
                        ['english', $combinedSearchTerm]
                    );
                }, 'calculations')
                // filter rows against the tsquery
                ->whereColumn('user_search_indices.searchable', '@@', 'calculations.tsquery')
                // add the calculated rank column to allow for ordering by text search rank
                ->addSelect(DB::raw('ts_rank(user_search_indices.searchable, calculations.tsquery) AS rank'))
                // Now that we have added a column, query builder no longer will add a * to the select.  Add all possible columns manually.
                ->addSelect(['users.*'])
                ->from('users');

            // negation setup
            preg_match_all('/(^|\s)[-!][^\s]+\b/', $combinedSearchTerm, $negationMatches);
            $matchesWithoutOperatorOrStartingSpace = array_map(fn ($string) => ltrim($string, " \-"), $negationMatches[0]); // 0th item is full matched
            $negationRemovedSearchTerm = preg_replace('/(^|\s)[-!][^\s]+\b/', '', $combinedSearchTerm);

            // remove text in quotation marks for partial matching
            $negationQuotedRemovedSearchTerm = preg_replace('/\"([^\"]*)\"/', '', $negationRemovedSearchTerm);

            // clear characters or search operators out, then array split for easy OR matching
            $filterToEmptySpace = ['"', '"', ':', '!'];
            $filterToSingleSpace = [' AND ', ' OR ', ' & '];
            $filtered = str_ireplace($filterToEmptySpace, '', $negationQuotedRemovedSearchTerm);
            $filtered = str_ireplace($filterToSingleSpace, ' ', $filtered);
            $whiteSpacingRemoved = trim($filtered);

            // if the remaining string is empty, don't turn into an array to avoid matching to ""
            $arrayed = $whiteSpacingRemoved === '' ? null : explode(' ', $whiteSpacingRemoved);

            if ($arrayed) {
                foreach ($arrayed as $index => $value) {
                    $query->orWhere(function ($query) use ($value, $matchesWithoutOperatorOrStartingSpace) {
                        $query->whereAny([
                            'first_name',
                            'last_name',
                            'email',
                        ], 'ilike', "%{$value}%"
                        );
                        $query->where(function ($query) use ($matchesWithoutOperatorOrStartingSpace) {
                            self::scopeNegationNameAndEmail($query, $matchesWithoutOperatorOrStartingSpace);
                        });
                    });
                }
            }
        }

        return $query;
    }

    public static function scopePublicProfileSearch(Builder $query, ?string $search): Builder
    {
        if ($search) {
            $query->where(function ($query) use ($search) {
                self::scopeName($query, $search);
                $query->orWhere(function ($query) use ($search) {
                    self::scopeEmail($query, $search);
                });
            });
        }

        return $query;
    }

    public static function scopeName(Builder $query, ?string $name): Builder
    {
        if ($name) {
            $splitName = explode(' ', $name);
            $query->where(function ($query) use ($splitName) {
                foreach ($splitName as $index => $value) {
                    $query->where('first_name', 'ilike', "%{$value}%")
                        ->orWhere('last_name', 'ilike', "%{$value}%");
                }
            });
        }

        return $query;
    }

    public static function scopeTelephone(Builder $query, ?string $telephone): Builder
    {
        if ($telephone) {
            $query->where('telephone', 'ilike', "%{$telephone}%");
        }

        return $query;
    }

    public static function scopeEmail(Builder $query, ?string $email): Builder
    {
        if ($email) {
            $query->where('email', 'ilike', "%{$email}%");
        }

        return $query;
    }

    public static function scopeWorkEmail(Builder $query, ?string $email): Builder
    {
        if ($email) {
            $query->where('work_email', 'ilike', "%{$email}%");
        }

        return $query;
    }

    public static function scopeExactWorkEmail(Builder $query, string $email): Builder
    {
        return $query->whereRaw('LOWER("work_email") = ?', [strtolower($email)]);
    }

    public static function scopeIsGovEmployee(Builder $query, ?bool $isGovEmployee): Builder
    {
        if ($isGovEmployee) {
            $query->where('computed_is_gov_employee', true);
        }

        return $query;
    }

    public static function scopeRoleAssignments(Builder $query, ?array $roleIds): Builder
    {
        if (empty($roleIds)) {
            return $query;
        }

        $query->where(function ($query) use ($roleIds) {
            $query->whereHas('roleAssignments', function ($query) use ($roleIds) {
                $query->whereIn('role_id', $roleIds);
            });
        });

        return $query;
    }

    // Prepares the parameters for Laratrust and then calls the function to modify the roles
    private function callRolesFunction($roleInput, $functionName)
    {
        // Laratrust doesn't recognize a string as an ID.  Therefore, we must convert to an array of key-value pairs where the key is 'id'.
        $roleIdObjectInArray = [['id' => $roleInput['roleId']]];

        // Laratrust doesn't recognize a string as an ID.  Therefore, we must convert the ID to a key-value pair where the key is 'id'.
        if (array_key_exists('teamId', $roleInput)) {
            $teamIdObject = ['id' => $roleInput['teamId']];
        } else {
            $teamIdObject = null;
        }

        return $this->$functionName($roleIdObjectInArray, $teamIdObject);
    }

    public function setRoleAssignmentsInputAttribute($roleAssignmentHasMany)
    {
        if (isset($roleAssignmentHasMany['attach'])) {
            foreach ($roleAssignmentHasMany['attach'] as $attachRoleInput) {
                $this->callRolesFunction($attachRoleInput, 'addRoles');
            }
        }

        if (isset($roleAssignmentHasMany['detach'])) {
            foreach ($roleAssignmentHasMany['detach'] as $detachRoleInput) {
                $this->callRolesFunction($detachRoleInput, 'removeRoles');
            }
        }
    }

    public function getTopTechnicalSkillsRankingAttribute()
    {
        $this->userSkills->loadMissing('skill');

        return $this->userSkills
            ->whereNotNull('top_skills_rank')
            ->where('skill.category', 'TECHNICAL')
            ->sortBy('top_skills_rank');
    }

    public function getTopBehaviouralSkillsRankingAttribute()
    {
        $this->userSkills->loadMissing('skill');

        return $this->userSkills
            ->whereNotNull('top_skills_rank')
            ->where('skill.category', 'BEHAVIOURAL')
            ->sortBy('top_skills_rank');
    }

    public function getImproveTechnicalSkillsRankingAttribute()
    {
        $this->userSkills->loadMissing('skill');

        return $this->userSkills
            ->whereNotNull('improve_skills_rank')
            ->where('skill.category', 'TECHNICAL')
            ->sortBy('improve_skills_rank');
    }

    public function getImproveBehaviouralSkillsRankingAttribute()
    {
        $this->userSkills->loadMissing('skill');

        return $this->userSkills
            ->whereNotNull('improve_skills_rank')
            ->where('skill.category', 'BEHAVIOURAL')
            ->sortBy('improve_skills_rank');
    }

    public static function scopeIsVerifiedGovEmployee(Builder $query): void
    {
        $query->where('computed_is_gov_employee', true)
            ->whereNotNull('work_email')
            ->whereNotNull('work_email_verified_at');
    }

    public function scopeAuthorizedToView(Builder $query, ?array $args = null): void
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if (isset($args['userId'])) {
            $user = User::findOrFail($args['userId']);
        }

        // can see any user - return with no filters added
        if ($user?->isAbleTo('view-any-user')) {
            return;
        }

        // we might want to add some filters for some users
        $filterCountBefore = count($query->getQuery()->wheres);
        $query->where(function (Builder $query) use ($user) {
            if ($user?->isAbleTo('view-team-applicantProfile')) {
                $query->orWhereHas('poolCandidates', function (Builder $query) use ($user) {
                    $allTeams = $user->rolesTeams()->get();
                    $teamIds = $allTeams->filter(function ($team) use ($user) {
                        return $user->isAbleTo('view-team-applicantProfile', $team);
                    })->pluck('id');

                    $query->whereHas('pool', function (Builder $query) use ($teamIds) {
                        $query
                            ->where('submitted_at', '<=', Carbon::now()->toDateTimeString())
                            ->where(function (Builder $query) use ($teamIds) {
                                $query
                                    ->whereHas('team', function (Builder $query) use ($teamIds) {
                                        return $query->whereIn('id', $teamIds);
                                    })
                                    ->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                                        return $query->whereIn('id', $teamIds);
                                    });
                            });
                    });
                });
            }

            if ($user?->isAbleTo('view-own-user')) {
                $query->orWhere('id', $user->id);
            }
        });
        $filterCountAfter = count($query->getQuery()->wheres);
        if ($filterCountAfter > $filterCountBefore) {
            return;
        }

        // fall through - return nothing
        $query->where('id', null);
    }

    public function scopeAuthorizedToViewBasicInfo(Builder $query): void
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        // special case: can see any basic info - return all users with no filters added
        if ($user?->isAbleTo('view-any-userBasicInfo')) {
            return;
        }

        // otherwise: use the regular authorized to view scope
        /** @var Builder<User> $query */
        $query->authorizedToView();
    }

    /**
     * Determine if the user has verified their email address.
     * Part of the MustVerifyEmail contract.
     *
     * @return bool
     */
    public function hasVerifiedEmail(EmailType $emailType)
    {
        // might be refined later, eg, must be verified within the last X months
        if ($emailType == EmailType::CONTACT) {
            return ! is_null($this->email_verified_at);
        } else {
            return ! is_null($this->work_email_verified_at);
        }

    }

    /**
     * Mark the given user's email as verified.
     * Part of the MustVerifyEmail contract.
     *
     * @return void
     */
    public function markEmailAsVerified(EmailType $emailType)
    {
        if ($emailType == EmailType::CONTACT) {
            $this->email_verified_at = Carbon::now();
        } else {
            $this->work_email_verified_at = Carbon::now();
        }
    }

    /**
     * Send the email verification notification.
     * Part of the MustVerifyEmail contract.
     *
     * @return void
     */
    public function sendEmailVerificationNotification(EmailType $emailType)
    {
        $message = new VerifyEmail($emailType);
        $this->notify($message);
    }

    /**
     * Get the email address that should be used for verification.
     * Part of the MustVerifyEmail contract.
     *
     * @return string
     */
    public function getEmailForVerification(EmailType $emailType)
    {
        return $this->{$emailType->value};
    }

    /**
     * Is the contact email address currently considered verified?
     */
    public function getIsEmailVerifiedAttribute()
    {
        return $this->hasVerifiedEmail(EmailType::CONTACT);
    }

    /**
     * Is the work email address currently considered verified?
     */
    public function getIsWorkEmailVerifiedAttribute()
    {
        return $this->hasVerifiedEmail(EmailType::WORK);
    }

    /** @return HasMany<TalentNomination, $this> */
    public function talentNominationsAsSubmitter(): HasMany
    {
        return $this->hasMany(TalentNomination::class, 'submitter_id');
    }

    public static function hydrateSnapshot(mixed $snapshot): User|array
    {
        $user = new User;

        $fields = [
            'first_name' => 'firstName',
            'last_name' => 'lastName',
            'email' => 'email',
            'telephone' => 'telephone',
            'current_city' => 'currentCity',
            'current_province' => 'currentProvince',
            'preferred_lang' => 'preferredLang',
            'preferred_language_for_interview' => 'preferredLanguageForInterview',
            'preferred_language_for_exam' => 'preferredLanguageForExam',
            'citizenship' => 'citizenship',
            'armed_forces_status' => 'armedForcesStatus',
            'looking_for_english' => 'lookingForEnglish',
            'looking_for_french' => 'lookingForFrench',
            'looking_for_bilingual' => 'lookingForBilingual',
            'first_official_language' => 'firstOfficialLanguage',
            'second_language_exam_completed' => 'secondLanguageExamCompleted',
            'second_language_exam_validity' => 'secondLanguageExamValidity',
            'comprehension_level' => 'comprehensionLevel',
            'written_level' => 'comprehensionLevel',
            'verbal_level' => 'verbalLevel',
            'estimated_language_ability' => 'estimatedLanguageAbility',
            'computed_is_gov_employee' => 'isGovEmployee',
            'work_email' => 'workEmail',
            'computed_gov_employee_type' => 'govEmployeeType',
            'computed_gov_position_type' => 'govPositionType',
            'computed_gov_end_date' => 'govEndDate',
            'computed_gov_role' => 'govRole',
            'has_priority_entitlement' => 'hasPriorityEntitlement',
            'priority_number' => 'priorityNumber',
            'location_preferences' => 'locationPreferences',
            'location_exemptions' => 'locationExemptions',
            'accepted_operational_requirements' => 'acceptedOperationalRequirements',
            'position_duration' => 'positionDuration',
            'is_woman' => 'isWoman',
            'has_disability' => 'hasDisability',
            'is_visible_minority' => 'isVisibleMinority',
            'indigenous_communities' => 'indigenousCommunities',
        ];

        /** @var User $user */
        $user = self::hydrateFields($snapshot, $fields, $user);

        if (isset($snapshot['department'])) {
            $user->computed_department = $snapshot['department']['id'];
        }

        if (isset($snapshot['currentClassification'])) {
            $user->computed_classification = $snapshot['currentClassification']['id'];
        }

        return $user;
    }

    /**
     * Combine the first name and last name into a full name
     */
    public function getFullNameAttribute()
    {
        return Str::trim($this->first_name.' '.$this->last_name);
    }
}
