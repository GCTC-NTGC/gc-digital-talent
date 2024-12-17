<?php

namespace App\Models;

use App\Observers\PoolCandidateSearchRequestObserver;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class PoolCandidateSearchRequest
 *
 * @property string $id
 * @property string $full_name
 * @property string $email
 * @property string $department_id
 * @property string $job_title
 * @property string $additional_comments
 * @property string $hr_advisor_email
 * @property string $pool_candidate_filter_id
 * @property bool $was_empty
 * @property string $admin_notes
 * @property string $request_status
 * @property int $request_status_weight
 * @property string $manager_job_title
 * @property string $position_type
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $deleted_at
 * @property ?\Carbon\CarbonImmutable $request_status_changed_at
 * @property string $reason
 * @property string $community_id
 * @property int $initial_result_count
 * @property string $user_id
 */
class PoolCandidateSearchRequest extends Model
{
    use HasFactory;
    use LogsActivity;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'request_status_changed_at' => 'datetime',
    ];

    /**
     * Boot function for using with PoolCandidateSearchRequest
     *
     * @return void
     */
    protected static function boot()
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        parent::boot();
        static::creating(function ($searchRequest) use ($user) {
            // unless the user_id was already specified use the currently authenticated user
            // needed to be able to set the value in a factory
            $searchRequest->user_id = $searchRequest->user_id ?? $user?->id;
        });
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        PoolCandidateSearchRequest::observe(PoolCandidateSearchRequestObserver::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*',
                'applicantFilter.has_diploma',
                'applicantFilter.has_disability',
                'applicantFilter.is_indigenous',
                'applicantFilter.is_visible_minority',
                'applicantFilter.is_woman',
                'applicantFilter.language_ability',
                'applicantFilter.location_preferences',
                'applicantFilter.operational_requirements',
                'applicantFilter.position_duration',
                'applicantFilter.qualified_streams',
            ])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /** @return BelongsTo<Department, $this> */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /** @return BelongsTo<PoolCandidateFilter, $this> */
    public function poolCandidateFilter(): BelongsTo
    {
        return $this->belongsTo(PoolCandidateFilter::class);
    }

    /** @return BelongsTo<ApplicantFilter, $this> */
    public function applicantFilter(): BelongsTo
    {
        return $this->belongsTo(ApplicantFilter::class);
    }

    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    public static function scopeId(Builder $query, ?string $id)
    {
        if ($id) {
            $query->where('id', 'ilike', "%{$id}%");
        }

        return $query;
    }

    /**
     * Scopes/filters
     */
    public static function scopeSearchRequestStatus(Builder $query, ?array $searchRequestStatuses)
    {
        if (empty($searchRequestStatuses)) {
            return $query;
        }

        $query->whereIn('request_status', $searchRequestStatuses);

        return $query;
    }

    public static function scopeWorkStreams(Builder $query, ?array $streams): Builder
    {
        if (empty($streams)) {
            return $query;
        }

        $query->whereHas('applicantFilter', function ($filterQuery) use ($streams) {
            $filterQuery->whereHas('workStreams', function ($workStreamQuery) use ($streams) {
                $workStreamQuery->whereIn('applicant_filter_work_stream.work_stream_id', $streams);
            });
        });

        return $query;
    }

    public static function scopeDepartments(Builder $query, ?array $departmentIds): Builder
    {
        if (empty($departmentIds)) {
            return $query;
        }

        $query->whereHas('department', function ($query) use ($departmentIds) {
            Department::scopeDepartmentsByIds($query, $departmentIds);
        });

        return $query;
    }

    public static function scopeClassifications(Builder $query, ?array $classificationIds): Builder
    {
        if (empty($classificationIds)) {
            return $query;
        }

        $query->whereHas('applicantFilter', function ($query) use ($classificationIds) {
            $query->whereHas('qualifiedClassifications', function ($query) use ($classificationIds) {
                $query->whereIn('classifications.id', $classificationIds);
            });
        });

        return $query;
    }

    public static function scopeFullName(Builder $query, ?string $fullName)
    {
        if ($fullName) {
            $query->where('full_name', 'ilike', "%{$fullName}%");
        }

        return $query;
    }

    public static function scopeEmail(Builder $query, ?string $email)
    {
        if ($email) {
            $query->where('email', 'ilike', "%{$email}%");
        }

        return $query;
    }

    public static function scopeJobTitle(Builder $query, ?string $jobTitle)
    {
        if ($jobTitle) {
            $query->where('job_title', 'ilike', "%{$jobTitle}%");
        }

        return $query;
    }

    public static function scopeAdditionalComments(Builder $query, ?string $additionalComments)
    {
        if ($additionalComments) {
            $query->where('additional_comments', 'ilike', "%{$additionalComments}%");
        }

        return $query;
    }

    public static function scopeAdminNotes(Builder $query, ?string $adminNotes)
    {
        if ($adminNotes) {
            $query->where('admin_notes', 'ilike', "%{$adminNotes}%");
        }

        return $query;
    }

    public static function scopeGeneralSearch(Builder $query, ?string $search): Builder
    {
        if ($search) {
            $query->where(function ($query) use ($search) {
                self::scopeFullName($query, $search);
                $query->orWhere(function ($query) use ($search) {
                    self::scopeId($query, $search);
                });
                $query->orWhere(function ($query) use ($search) {
                    self::scopeEmail($query, $search);
                });
                $query->orWhere(function ($query) use ($search) {
                    self::scopeJobTitle($query, $search);
                });
                $query->orWhere(function ($query) use ($search) {
                    self::scopeAdditionalComments($query, $search);
                });
                $query->orWhere(function ($query) use ($search) {
                    self::scopeAdminNotes($query, $search);
                });
            });
        }

        return $query;
    }

    /**
     * Scope the query to SearchRequests the current user can view
     */
    public function scopeAuthorizedToView(Builder $query)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if ($user?->isAbleTo('view-any-searchRequest')) {
            return $query;
        }

        if ($user?->isAbleTo('view-team-searchRequest')) {
            $query->where(function (Builder $query) use ($user) {

                $allTeam = $user->rolesTeams()->get();
                $teamIds = $allTeam->filter(function ($team) use ($user) {
                    return $user->isAbleTo('view-team-searchRequest', $team);
                })->pluck('id');

                $query->whereHas('community.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });

            });

            return $query;
        }

        // fallback
        return $query->where('id', null);
    }

    /**
     * Getters/Mutators
     */
    public function setStatusAttribute($statusInput): void
    {
        $this->request_status = $statusInput;
        $this->request_status_changed_at = CarbonImmutable::now();
    }
}
