<?php

namespace App\Models;

use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateSuspendedFilter;
use App\Enums\CitizenshipStatus;
use App\Enums\IndigenousCommunity;
use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PoolCandidateStatus;
use App\Enums\PositionDuration;
use App\Traits\EnrichedNotifiable;
use Carbon\Carbon;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laratrust\Contracts\LaratrustUser;
use Laratrust\Traits\HasRolesAndPermissions;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\CausesActivity;
use Spatie\Activitylog\Traits\LogsActivity;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class User
 *
 * @property string $id
 * @property string $email
 * @property string $sub
 * @property string $first_name
 * @property string $last_name
 * @property string $telephone
 * @property string $preferred_lang
 * @property string $current_province
 * @property string $current_city
 * @property bool $looking_for_english
 * @property bool $looking_for_french
 * @property bool $looking_for_bilingual
 * @property string $first_official_language
 * @property bool $second_language_exam_completed
 * @property bool $second_language_exam_validity
 * @property string $comprehension_level
 * @property string $written_level
 * @property string $verbal_level
 * @property string $estimated_language_ability
 * @property string $is_gov_employee
 * @property bool $has_priority_entitlement
 * @property string $priority_number
 * @property string $department
 * @property string $current_classification
 * @property string $citizenship
 * @property string $armed_forces_status
 * @property bool $is_woman
 * @property bool $has_disability
 * @property bool $is_visible_minority
 * @property bool $has_diploma
 * @property array $location_preferences
 * @property string $location_exemptions
 * @property array $position_duration
 * @property array $accepted_operational_requirements
 * @property string $gov_employee_type
 * @property int $priority_weight
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property string $indigenous_declaration_signature
 * @property array $indigenous_communities
 * @property string $preferred_language_for_interview
 * @property string $preferred_language_for_exam
 * @property array $ignored_email_notifications
 * @property array $ignored_in_app_notifications
 */
class User extends Model implements Authenticatable, HasLocalePreference, LaratrustUser
{
    use AuthenticatableTrait;
    use Authorizable;
    use CausesActivity;
    use EnrichedNotifiable;
    use HasFactory;
    use HasRelationships;
    use HasRolesAndPermissions;
    use LogsActivity;
    use Searchable;
    use SoftDeletes;

    protected static $selectableColumns = [
        'id',
        'email',
        'first_name',
        'last_name',
        'telephone',
        'sub',
        'preferred_lang',
        'current_province',
        'current_city',
        'looking_for_english',
        'looking_for_french',
        'looking_for_bilingual',
        'first_official_language',
        'second_language_exam_completed',
        'second_language_exam_validity',
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
        'preferred_language_for_exam',
        'deleted_at',
        'ignored_email_notifications',
        'ignored_in_app_notifications',
        'created_at',
        'updated_at',
    ];

    protected $keyType = 'string';

    protected $casts = [
        'location_preferences' => 'array',
        'accepted_operational_requirements' => 'array',
        'position_duration' => 'array',
        'indigenous_communities' => 'array',
        'ignored_email_notifications' => 'array',
        'ignored_in_app_notifications' => 'array',
    ];

    protected $fillable = [
        'email',
        'sub',
        'searchable',
    ];

    protected $hidden = [
        'searchable',
    ];

    public static function getSelectableColumns()
    {
        return self::$selectableColumns;
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
     * Get the user's preferred locale.
     */
    public function preferredLocale(): string
    {
        return $this->preferred_lang;
    }

    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }

    public function poolBookmarks(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pool_user_bookmarks', "user_id", "pool_id")->withTimestamps();
    }

    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class)->withTrashed();
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department')
            ->select(['id', 'name', 'department_number']);
    }

    public function currentClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'current_classification');
    }

    // All the relationships for experiences
    public function awardExperiences(): HasMany
    {
        return $this->hasMany(AwardExperience::class);
    }

    public function communityExperiences(): HasMany
    {
        return $this->hasMany(CommunityExperience::class);
    }

    public function educationExperiences(): HasMany
    {
        return $this->hasMany(EducationExperience::class);
    }

    public function personalExperiences(): HasMany
    {
        return $this->hasMany(PersonalExperience::class);
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    // A relationship to the custom roleAssignments pivot model
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }

    public function userSkills(): HasMany
    {
        return $this->hasMany(UserSkill::class, 'user_id');
    }

    public function skills()
    {
        return $this->hasManyDeepFromRelations($this->userSkills(), (new UserSkill())->skill());
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
            $userSkill = new UserSkill();
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

    public function getLocation()
    {
        if ($this->current_city && $this->current_province) {
            return $this->current_city.', '.$this->current_province;
        } elseif ($this->current_city) {
            return $this->current_city;
        } elseif ($this->current_province) {
            return $this->current_province;
        }

        return '';
    }

    public function getLanguage(string $key)
    {
        $code = $this->$key;
        if ($code !== 'en' && $code !== 'fr') {
            return '';
        }

        return $code === 'en' ? 'English' : 'French';
    }

    public function getArmedForcesStatus()
    {
        switch ($this->armed_forces_status) {
            case ArmedForcesStatus::MEMBER->name:
                return 'Member';
            case ArmedForcesStatus::VETERAN->name:
                return 'Veteran';
            default:
                return 'Not in the CAF';
        }
    }

    public function getCitizenship()
    {
        switch ($this->citizenship) {
            case CitizenshipStatus::CITIZEN->name:
                return 'Canadian citizen';
            case CitizenshipStatus::PERMANENT_RESIDENT->name:
                return 'Permanent resident';
            default:
                return 'Other';
        }
    }

    public function getLookingForLanguage()
    {
        if ($this->looking_for_bilingual) {
            return 'Bilingual positions (English and French)';
        } elseif ($this->looking_for_english && $this->looking_for_french) {
            return 'English or French positions';
        } elseif ($this->looking_for_english) {
            return 'English positions';
        } elseif ($this->looking_for_french) {
            return 'French positions';
        }

        return '';
    }

    public function getSecondLanguageEvaluation()
    {
        if ($this->comprehension_level || $this->written_level || $this->verbal_level) {
            return sprintf('%s, %s, %s',
                $this->comprehension_level ?? '',
                $this->written_level ?? '',
                $this->verbal_level ?? ''
            );
        }

        return '';
    }

    public function getGovEmployeeType()
    {
        if (! $this->gov_employee_type) {
            return '';
        }

        return ucwords(strtolower($this->gov_employee_type));
    }

    public function getClassification()
    {
        if (! $this->current_classification) {
            return '';
        }

        $classification = $this->currentClassification()->first();

        return $classification->group.'-0'.$classification->level;
    }

    public function getDepartment()
    {
        if (! $this->department) {
            return '';
        }

        return $this->department()->get('name');
    }

    public function getIndigenousCommunities()
    {
        if (empty($this->indigenous_communities)) {
            return null;
        }

        return array_map(function ($community) {
            return match ($community) {
                IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name => 'Non-status First Nations',
                IndigenousCommunity::STATUS_FIRST_NATIONS->name => 'Status First Nations',
                IndigenousCommunity::INUIT->name => 'Inuk (Inuit)',
                IndigenousCommunity::METIS->name => 'Métis',
                IndigenousCommunity::OTHER->name => 'Other',
                IndigenousCommunity::LEGACY_IS_INDIGENOUS->name => 'Indigenous',
                default => 'Unknown'
            };
        }, $this->indigenous_communities);
    }

    public function getPositionDuration()
    {
        if (in_array(PositionDuration::PERMANENT->name, $this->position_duration)) {
            return 'Permanent duration';
        }

        return null;
    }

    public function getPriority()
    {
        $priority = [];
        if ($this->has_priority_entitlement) {
            $priority[] = 'Priority entitlement';
        }
        if ($this->armed_forces_status === ArmedForcesStatus::VETERAN->name) {
            $priority[] = 'Veteran';
        }
        if ($this->citizenship === CitizenshipStatus::PERMANENT_RESIDENT->name || $this->citizenship === CitizenshipStatus::CITIZEN->name) {
            $priority[] = 'Permanent resident';
        }

        return implode(', ', $priority);
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
            is_null($this->attributes['is_gov_employee']) or
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
            $query->whereNotNull('is_gov_employee');
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
                foreach ($user->poolCandidates() as $candidate) {
                    $candidate->delete();
                }

                // Modify the email to allow it to be used for another user
                $newEmail = $user->email.'-deleted-at-'.Carbon::now()->format('Y-m-d');
                $user->update(['email' => $newEmail]);
            }
            $user->searchable();
        });

        static::restoring(function (User $user) {
            // Cascade restore to child models
            foreach ($user->poolCandidates()->withTrashed()->get() as $candidate) {
                $candidate->restore();
            }

            $newEmail = $user->email.'-restored-at-'.Carbon::now()->format('Y-m-d');
            $user->update(['email' => $newEmail]);
        });
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
     *
     * @param  Eloquent\Builder  $query  The existing query being built
     * @param  ?array  $publishingGroups  The publishing groups to scope the query by
     * @return Eloquent\Builder The resulting query
     */
    public static function scopePublishingGroups(Builder $query, ?array $publishingGroups)
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
    public static function scopeTalentSearchablePublishingGroup(Builder $query): Builder
    {
        return $query->whereHas('poolCandidates', function ($innerQueryBuilder) {
            PoolCandidate::scopeAvailable($innerQueryBuilder);
            PoolCandidate::scopeInTalentSearchablePublishingGroup($innerQueryBuilder);

            return $innerQueryBuilder;
        });
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
            $combinedSearchTerm = trim($searchTerm);

            $query
                // attach the tsquery to every row to use for filtering
                ->crossJoinSub(function ($query) use ($combinedSearchTerm) {
                    $query->selectRaw(
                        'websearch_to_tsquery(coalesce(?, get_current_ts_config()), ?)'.' AS tsquery',
                        ['english', $combinedSearchTerm]
                    );
                }, 'calculations')
                // filter rows against the tsquery
                ->whereColumn('searchable', '@@', 'calculations.tsquery')
                // add the calculated rank column to allow for ordering by text search rank
                ->addSelect(DB::raw('ts_rank(searchable, calculations.tsquery) AS rank'))
                // Now that we have added a column, query builder no longer will add a * to the select.  Add all possible columns manually.
                ->addSelect(self::$selectableColumns);

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

    public static function scopeIsGovEmployee(Builder $query, ?bool $isGovEmployee): Builder
    {
        if ($isGovEmployee) {
            $query->where('is_gov_employee', true);
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
    private function callRolesFunction($rolesInput, $functionName)
    {
        // Laratrust doesn't recognize a string as an ID.  Therefore, we must convert the array of IDs to an array of key-value pairs where the key is 'id'.
        $roleIdObjects = array_map(function ($id) {
            return ['id' => $id];
        }, $rolesInput['roles']);

        // Laratrust doesn't recognize a string as an ID.  Therefore, we must convert the ID to a key-value pair where the key is 'id'.
        if (array_key_exists('team', $rolesInput)) {
            $teamIdObject = ['id' => $rolesInput['team']];
        } else {
            $teamIdObject = null;
        }

        return $this->$functionName($roleIdObjects, $teamIdObject);
    }

    public function setRoleAssignmentsInputAttribute($roleAssignmentHasMany)
    {
        if (array_key_exists('attach', $roleAssignmentHasMany)) {
            $this->callRolesFunction($roleAssignmentHasMany['attach'], 'addRoles');
        }

        if (array_key_exists('detach', $roleAssignmentHasMany)) {
            $this->callRolesFunction($roleAssignmentHasMany['detach'], 'removeRoles');
        }

        if (array_key_exists('sync', $roleAssignmentHasMany)) {
            $this->callRolesFunction($roleAssignmentHasMany['sync'], 'syncRoles');
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

    public function scopeAuthorizedToViewSpecific(Builder $query)
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        if (! $user) {
            return $query->where('id', null);
        }

        $query->where(function (Builder $query) use ($user) {
            if ($user->isAbleTo('view-team-applicantProfile')) {
                $query->orWhereHas('poolCandidates', function (Builder $query) use ($user) {
                    $teamIds = $user->rolesTeams()->get()->pluck('id');
                    $query->whereHas('pool', function (Builder $query) use ($teamIds) {
                        return $query
                            ->where('submitted_at', '<=', Carbon::now()->toDateTimeString())
                            ->whereHas('team', function (Builder $query) use ($teamIds) {
                                return $query->whereIn('id', $teamIds);
                            });
                    });
                });
            }
            if ($user->isAbleTo('view-own-user')) {
                $query->orWhere('id', $user->id);
            }
        });

        return $query;
    }

    public function scopeAuthorizedToView(Builder $query)
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        if (! $user) {
            return $query->where('id', null);
        }

        if (! $user->isAbleTo('view-any-user')) {
            $query = self::scopeAuthorizedToViewSpecific($query);
        }

        return $query;
    }

    public function scopeAuthorizedToViewBasicInfo(Builder $query)
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        if (! $user) {
            return $query->where('id', null);
        }

        if (! $user->isAbleTo('view-any-user') && ! $user->isAbleTo('view-any-userBasicInfo')) {
            $query = self::scopeAuthorizedToViewSpecific($query);
        }

        return $query;
    }
}
