<?php

namespace App\Models;

use App\Enums\CafForce;
use App\Enums\EmploymentCategory;
use App\Events\WorkExperienceSaved;
use App\Models\Scopes\MatchExperienceType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;
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
    ];

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
}
