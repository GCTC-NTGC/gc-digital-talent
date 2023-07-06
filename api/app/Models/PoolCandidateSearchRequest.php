<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\CarbonImmutable;

/**
 * Class PoolCandidateSearchRequest
 *
 * @property int $id
 * @property string $full_name
 * @property string $email
 * @property int $department_id
 * @property string $job_title
 * @property string $additional_comments
 * @property string $pool_candidate_filter_id
 * @property boolean $was_empty
 * @property string $admin_notes
 * @property string $request_status
 * @property int $request_status_weight
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $deleted_at
 * @property Illuminate\Support\Carbon $status_changed_at
 */

class PoolCandidateSearchRequest extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */

    protected $casts = [
        'done_at' => 'datetime',
    ];

    /**
     * Model relations
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function poolCandidateFilter(): BelongsTo
    {
        return $this->belongsTo(PoolCandidateFilter::class);
    }

    public function applicantFilter(): BelongsTo
    {
        return $this->belongsTo(ApplicantFilter::class);
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

    public static function scopeStreams(Builder $query, ?array $streams): Builder
    {
        if (empty($streams)) {
            return $query;
        }

        // streams is an array of PoolStream enums
        $query->whereHas('applicantFilter', function ($query) use ($streams) {
            $query->where(function ($query) use ($streams) {
                foreach ($streams as $index => $stream) {
                    $query->orWhereJsonContains('qualified_streams', $stream);
                }
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
     * Getters/Mutators
     */

    public function setStatusAttribute($statusInput): void
    {
        $this->request_status = $statusInput;
        $this->status_changed_at = CarbonImmutable::now();
    }
}
