<?php

namespace App\Models;

use App\Enums\CafForce;
use App\Enums\EmploymentCategory;
use App\Enums\GovEmployeeType;
use App\Events\WorkExperienceSaved;
use App\Notifications\System as SystemNotification;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;

/**
 * Class WorkExperience
 *
 * @property string $id
 * @property string $user_id
 * @property string $role
 * @property string $organization
 * @property string $division
 * @property ?\Illuminate\Support\Carbon $start_date
 * @property ?\Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property string $employment_category
 * @property ?string $ext_size_of_organization
 * @property ?string $ext_role_seniority
 * @property ?string $gov_employment_type
 * @property ?string $gov_position_type
 * @property ?string $gov_contractor_role_seniority
 * @property ?string $gov_contractor_type
 * @property ?string $caf_employment_type
 * @property ?string $caf_force
 * @property ?string $caf_rank
 * @property ?string $classification_id
 * @property ?string $department_id
 * @property ?string $contractor_firm_agency_name
 * @property ?bool $supervisory_position
 * @property ?bool $supervised_employees
 * @property ?int $supervised_employees_number
 * @property ?bool $budget_management
 * @property ?int $annual_budget_allocation
 * @property ?bool $senior_management_status
 * @property ?string $c_suite_role_title
 * @property ?string $other_c_suite_role_title
 * @property array $workStreams
 */
class WorkExperience extends Experience
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    /**
     * Listeners for model events
     */
    protected $dispatchesEvents = [
        'saved' => WorkExperienceSaved::class,
        'deleted' => WorkExperienceSaved::class,
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'supervisory_position' => 'boolean',
        'supervised_employees' => 'boolean',
        'supervised_employees_number' => 'integer',
        'budget_management' => 'boolean',
        'annual_budget_allocation' => 'integer',
        'senior_management_status' => 'boolean',
    ];

    protected static $hydrationFields = [
        'organization' => 'organization',
        'role' => 'role',
        'division' => 'division',
        'start_date' => 'startDate',
        'end_date' => 'endDate',
        'employment_category' => 'employmentCategory',
        'ext_size_of_organization' => 'extSizeOfOrganization',
        'ext_role_seniority' => 'extRoleSeniority',
        'gov_employment_type' => 'govEmploymentType',
        'gov_position_type' => 'govPositionType',
        'gov_contractor_role_seniority' => 'govContractorRoleSeniority',
        'gov_contractor_type' => 'govContractorType',
        'caf_employment_type' => 'cafEmploymentType',
        'caf_force' => 'cafForce',
        'caf_rank' => 'cafRank',
        'classification_id' => 'classificationId',
        'department_id' => 'departmentId',
        'contractor_firm_agency_name' => 'contractorFirmAgencyName',
        'supervisory_position' => 'supervisoryPosition',
        'supervised_employees' => 'supervisedEmployees',
        'supervised_employees_number' => 'supervisedEmployeesNumber',
        'budget_management' => 'budgetManagement',
        'annual_budget_allocation' => 'annualBudgetAllocation',
        'senior_management_status' => 'seniorManagementStatus',
        'c_suite_role_title' => 'cSuiteRoleTitle',
        'other_c_suite_role_title' => 'otherCSuiteRoleTitle',
        'work_stream_ids' => 'workStreamIds',
    ];

    /**
     * Boot function for using with Eloquent Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function (WorkExperience $workExperience) {
            // send an in-app notification upon creation of a work experience that is GOV + TERM/INDETERMINATE + CURRENT
            // only if a work email has not been verified

            $now = Carbon::now();
            $user = $workExperience->user;
            $viewGroup = 'notification_government_experience_verify_work_email';

            if (is_null($user?->work_email_verified_at)) {

                if (
                    $workExperience->employment_category === EmploymentCategory::GOVERNMENT_OF_CANADA->name &&
                    ($workExperience->gov_employment_type === GovEmployeeType::TERM->name || $workExperience->gov_employment_type === GovEmployeeType::INDETERMINATE->name) &&
                    ($workExperience->end_date === null || $workExperience->end_date > $now)
                ) {

                    try {
                        $notification = new SystemNotification(
                            channelEmail: false,
                            channelApp: true,
                            emailSubjectEn: '',
                            emailSubjectFr: '',
                            emailContentEn: '',
                            emailContentFr: '',
                            inAppMessageEn: $viewGroup.'.in_app_message_en',
                            inAppMessageFr: $viewGroup.'.in_app_message_fr',
                            inAppHrefEn: $viewGroup.'.in_app_href_en',
                            inAppHrefFr: $viewGroup.'.in_app_href_fr',
                        );
                        $user->notify($notification);
                    } catch (\Throwable $e) {
                        Log::error('Error sending work experience verification notification to user '.$user->id.' experience '.$workExperience->id.' '.$e->getMessage());
                        throw $e;
                    }
                }
            }
        });
    }

    public function getTitle(?string $lang = 'en'): string
    {
        if ($this->employment_category === EmploymentCategory::EXTERNAL_ORGANIZATION->name) {
            return sprintf('%s %s %s', $this->role, Lang::get('common.with', [], $lang), $this->organization);
        }

        if ($this->employment_category === EmploymentCategory::GOVERNMENT_OF_CANADA->name) {
            /** @var Department | null $department */
            $department = $this->department_id ? Department::find($this->department_id) : null;

            return sprintf('%s %s %s', $this->role, Lang::get('common.with', [], $lang), $department ? $department->name[$lang] : Lang::get('common.not_found', [], $lang));
        }

        if ($this->employment_category === EmploymentCategory::CANADIAN_ARMED_FORCES->name) {
            $caf_force = $this->caf_force ? CafForce::localizedString($this->caf_force)[$lang] : Lang::get('common.not_found', [], $lang);

            return sprintf('%s %s %s', $this->role, Lang::get('common.with', [], $lang), $caf_force);
        }

        return sprintf('%s %s %s', $this->role, Lang::get('common.with', [], $lang), $this->organization);
    }

    // extends dateRange, check if the end date is in the future and append a message if needed
    public function getDateRangeWithFutureEndDateCheck($lang = 'en'): string
    {
        $format = 'MMM Y';
        $start = $this->start_date->locale($lang)->isoFormat($format);
        $now = date('Y-m-d');

        if (isset($this->end_date)) {
            $end = $this->end_date->locale($lang)->isoFormat($format);

            // imprecise comparison, experience dates default to first day of the month
            if ($this->end_date > $now) {
                return "$start - $end".' '.Lang::get('common.expected_end_date', [], $lang);
            }

            return "$start - $end";
        }

        $end = Lang::get('common.present', [], $lang);

        return "$start - $end";
    }

    public function getExperienceType(): string
    {
        return WorkExperience::class;
    }

    public function getDateRange($lang = 'en'): string
    {
        $format = 'MMM Y';

        $start = $this->start_date->locale($lang)->isoFormat($format);
        $end = $this->end_date ? $this->end_date->locale($lang)->isoFormat($format) : Lang::get('common.present', [], $lang);

        return "$start - $end";
    }

    /**
     * Return the classification model related to the experience
     */
    public function classification()
    {
        return $this->belongsTo(Classification::class);
    }

    /**
     * Return the department model related to the experience
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function workStreams(): BelongsToMany
    {
        return $this->belongsToMany(WorkStream::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
