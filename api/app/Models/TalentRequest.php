<?php

namespace App\Models;

use App\Builders\TalentRequestBuilder;
use App\Enums\TalentRequestCompletionDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestStatus;
use App\Observers\TalentRequestObserver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * Class TalentRequest
 *
 * @property string $id
 * @property string $full_name
 * @property string $email
 * @property string $department_id
 * @property string $job_title
 * @property ?string $hr_advisor_email
 * @property ?string $manager_job_title
 * @property ?string $position_type
 * @property ?string $reason
 * @property ?string $additional_comments
 * @property bool $was_empty
 * @property ?int $initial_result_count
 * @property ?string $admin_notes
 * @property string $status
 * @property int $status_weight
 * @property ?string $in_progress_details
 * @property ?string $completion_details
 * @property ?Carbon $follow_up_date
 * @property ?Carbon $status_changed_at
 * @property string $applicant_filter_id
 * @property string $community_id
 * @property ?string $user_id
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 * @property ?Carbon $deleted_at
 */
class TalentRequest extends Model
{
    use HasFactory;
    use LogsActivity;
    use SoftDeletes;

    protected $keyType = 'string';

    protected $casts = [
        'status_changed_at' => 'datetime',
        'follow_up_date' => 'date',
    ];

    protected static function booted(): void
    {
        TalentRequest::observe(TalentRequestObserver::class);
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
            ->dontLogEmptyChanges();
    }

    public function newEloquentBuilder($query): Builder
    {
        return new TalentRequestBuilder($query);
    }

    /** @return BelongsTo<Department, $this> */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
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

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<TalentRequestTrackedUser, $this> */
    public function trackedUsers(): HasMany
    {
        return $this->hasMany(TalentRequestTrackedUser::class)->withSourceExists($this->id);
    }

    /**
     * Aggregate accessor: returns the localized label for whichever detail field is populated.
     */
    public function details(): Attribute
    {
        return Attribute::get(function () {
            if ($this->status === TalentRequestStatus::IN_PROGRESS->name && ! is_null($this->in_progress_details)) {
                return TalentRequestInProgressDetail::localizedString($this->in_progress_details);
            }
            if ($this->status === TalentRequestStatus::COMPLETED->name && ! is_null($this->completion_details)) {
                return TalentRequestCompletionDetail::localizedString($this->completion_details);
            }

            return null;
        });
    }

    public function progress(string $inProgressDetail, Carbon|string|null $followUpDate): void
    {
        $this->status = TalentRequestStatus::IN_PROGRESS->name;
        $this->in_progress_details = $inProgressDetail;
        $this->completion_details = null;
        $this->follow_up_date = $followUpDate;
        $this->save();
    }

    public function complete(string $completionDetail): void
    {
        $this->status = TalentRequestStatus::COMPLETED->name;
        $this->completion_details = $completionDetail;
        $this->in_progress_details = null;
        $this->follow_up_date = null;
        $this->save();
    }
}
