<?php

namespace App\Models;

use App\Enums\CafForce;
use App\Enums\EmploymentCategory;
use App\Enums\GovEmployeeType;
use App\Events\WorkExperienceSaved;
use App\Models\Scopes\MatchExperienceType;
use App\Notifications\System as SystemNotification;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Staudenmeir\EloquentJsonRelations\HasJsonRelationships;
use Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson;

/**
 * Class WorkExperience
 *
 * @property int $id
 * @property int $user_id
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
 * @property ?int $supervised_employees
 * @property ?string $supervised_employees_number
 * @property ?bool $budget_management
 * @property ?int $annual_budget_allocation
 * @property ?bool $senior_management_status
 * @property ?string $c_suite_role_title
 * @property ?string $other_c_suite_role_title
 */
class WorkExperience extends Experience
{
    use HasFactory;
    use HasJsonRelationships;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'experiences';

    protected $casts = [
        'properties' => 'json',
    ];

    /**
     * Default values for attributes
     */
    protected $attributes = [
        'experience_type' => WorkExperience::class,
    ];

    /**
     * Listeners for model events
     */
    protected $dispatchesEvents = [
        'saved' => WorkExperienceSaved::class,
        'deleted' => WorkExperienceSaved::class,
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

            $properties = $workExperience->properties;
            $now = Carbon::now();
            $user = $workExperience->user;
            $viewGroup = 'notification_government_experience_verify_work_email';

            if (
                $user &&
                is_null($user->work_email_verified_at) &&
                $properties &&
                array_key_exists('employment_category', $properties) &&
                array_key_exists('gov_employment_type', $properties) &&
                array_key_exists('end_date', $properties)
            ) {

                if (
                    $properties['employment_category'] === EmploymentCategory::GOVERNMENT_OF_CANADA->name &&
                    ($properties['gov_employment_type'] === GovEmployeeType::TERM->name || $properties['gov_employment_type'] === GovEmployeeType::INDETERMINATE->name) &&
                    ($properties['end_date'] === null || $properties['end_date'] > $now)
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

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new MatchExperienceType);
    }

    /**
     * Interact with the experience's role
     */
    protected function role(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('role');
    }

    /**
     * Interact with the experience's organization
     */
    protected function organization(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('organization');
    }

    /**
     * Interact with the experience's division
     */
    protected function division(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('division');
    }

    /**
     * Interact with the experience's start date
     */
    protected function startDate(): Attribute
    {
        return $this->makeJsonPropertyDateAttribute('start_date');
    }

    /**
     * Interact with the experience's end date
     */
    protected function endDate(): Attribute
    {
        return $this->makeJsonPropertyDateAttribute('end_date');
    }

    /**
     * Interact with the employment category
     */
    protected function employmentCategory(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('employment_category');
    }

    /**
     * Interact with the external organization size
     */
    protected function extSizeOfOrganization(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('ext_size_of_organization');
    }

    /**
     * Interact with the external role seniority
     */
    protected function extRoleSeniority(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('ext_role_seniority');
    }

    /**
     * Interact with the government employee type
     */
    protected function govEmploymentType(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('gov_employment_type');
    }

    /**
     * Interact with the government position type
     */
    protected function govPositionType(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('gov_position_type');
    }

    /**
     * Interact with the government contractor role seniority
     */
    protected function govContractorRoleSeniority(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('gov_contractor_role_seniority');
    }

    /**
     * Interact with the government contractor type
     */
    protected function govContractorType(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('gov_contractor_type');
    }

    /**
     * Interact with the contractor firm or agency name
     */
    protected function contractorFirmAgencyName(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('contractor_firm_agency_name');
    }

    /**
     * Interact with the canadian armed forces type
     */
    protected function cafEmploymentType(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('caf_employment_type');
    }

    /**
     * Interact with the canadian armed forces selection
     */
    protected function cafForce(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('caf_force');
    }

    /**
     * Interact with the canadian armed forces rank
     */
    protected function cafRank(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('caf_rank');
    }

    /**
     * Interact with the saved classification id
     */
    protected function classificationId(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('classification_id');
    }

    /**
     * Interact with the saved department id
     */
    protected function departmentId(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('department_id');
    }

    /**
     * Interact with the saved work stream ids
     */
    protected function workStreamIds(): Attribute
    {
        return $this->makeJsonPropertyArrayAttribute('work_stream_ids');
    }

    /**
     * Return the classification model from JSON
     */
    public function classification()
    {
        return $this->belongsTo(Classification::class, 'properties->classification_id');
    }

    /**
     * Return the department model from JSON
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'properties->department_id');
    }

    public function workStreams(): BelongsToJson
    {
        return $this->belongsToJson(WorkStream::class, 'properties->work_stream_ids');
    }

    protected function supervisoryPosition(): Attribute
    {
        return $this->makeJsonPropertyBooleanAttribute('supervisory_position');
    }

    protected function supervisedEmployees(): Attribute
    {
        return $this->makeJsonPropertyBooleanAttribute('supervised_employees');
    }

    protected function supervisedEmployeesNumber(): Attribute
    {
        return $this->makeJsonPropertyNumberAttribute('supervised_employees_number');
    }

    protected function budgetManagement(): Attribute
    {
        return $this->makeJsonPropertyBooleanAttribute('budget_management');
    }

    protected function annualBudgetAllocation(): Attribute
    {
        return $this->makeJsonPropertyNumberAttribute('annual_budget_allocation');
    }

    protected function seniorManagementStatus(): Attribute
    {
        return $this->makeJsonPropertyBooleanAttribute('senior_management_status');
    }

    protected function cSuiteRoleTitle(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('c_suite_role_title');
    }

    protected function otherCSuiteRoleTitle(): Attribute
    {
        return $this->makeJsonPropertyStringAttribute('other_c_suite_role_title');
    }
}
