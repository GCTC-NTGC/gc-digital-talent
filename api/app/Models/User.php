<?php

namespace App\Models;

use App\Builders\UserBuilder;
use App\Casts\LanguageCode;
use App\Enums\EmailType;
use App\Enums\OperationalRequirement;
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
        'preferred_lang' => LanguageCode::class,
        'preferred_language_for_interview' => LanguageCode::class,
        'preferred_language_for_exam' => LanguageCode::class,
        'first_official_language' => LanguageCode::class,
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
     * Binds the eloquent builder to the model to allow for
     * applying scopes directly to Pool query builders
     *
     * i.e User::query()->whereName();
     */
    public function newEloquentBuilder($query): Builder
    {
        return new UserBuilder($query);
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
        return strtolower($this->preferred_lang ?? 'en');
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
