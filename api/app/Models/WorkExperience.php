<?php

namespace App\Models;

use App\Enums\CafForce;
use App\Enums\EmploymentCategory;
use App\Enums\GovEmployeeType;
use App\Events\WorkExperienceSaved;
use App\Notifications\System as SystemNotification;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;

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
 * @property ?bool $supervised_employees
 * @property ?int $supervised_employees_number
 * @property ?bool $budget_management
 * @property ?int $annual_budget_allocation
 * @property ?bool $senior_management_status
 * @property ?string $c_suite_role_title
 * @property ?string $other_c_suite_role_title
 * @property array $workStreams
 */
class WorkExperience extends Model
{
    use HasFactory;
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
     * @var array
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

    /** @return BelongsToMany<UserSkill, $this> */
    public function userSkills(): BelongsToMany
    {
        return $this->belongsToMany(UserSkill::class, 'experience_skill', 'experience_id')
            ->withTimestamps()
            ->withPivot(['details', 'deleted_at'])
            ->wherePivotNull('deleted_at')
            ->as('experience_skill');
    }

    public function skills(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->userSkills(), (new UserSkill)->skill())
            ->withPivot('experience_skill', ['created_at', 'updated_at', 'details'])
            ->whereNull('experience_skill.deleted_at')
            ->withTrashed(); // from the deep relation $this->userSkills->skills fetch soft deleted skills but not userSkills
    }

    /** @return HasMany<ExperienceSkill, $this> */
    public function experienceSkills(): HasMany
    {
        return $this->hasMany(ExperienceSkill::class);
    }

    /**
     * Sync means we will add missing skills, remove skills not in this array, and update the details of existing skills.
     *
     * @param  array<string, array<string, string>>|null  $skills  - Skills must be an array of items, each of which must have an id, and optionally have a details string.
     * @return void
     */
    public function syncSkills($skills)
    {
        if ($skills === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }

        $skillIds = collect($skills)->pluck('id');
        // First ensure that UserSkills exist for each of these skills
        $this->user->addSkills($skillIds);

        // Soft-delete any existing ExperienceSkills left out of this sync operation
        ExperienceSkill::where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereNotIn('skill_id', $skillIds);
            })
            ->delete();

        // Now connect the skills which ARE in this sync operation
        $this->connectSkills($skills);
    }

    /**
     * Connect means we will add missing skills and update the details of existing skills, but not remove any skills.
     *
     * @param  array<string, array<string, string>>|null  $skills  - Skills must be an array of items, each of which must have an id, and optionally have a details string.
     * @return void
     */
    public function connectSkills($skills)
    {
        if ($skills === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }

        // First ensure that UserSkills exist for each of these skills
        $skillIds = collect($skills)->pluck('id');
        $this->user->addSkills($skillIds);

        $userSkills = UserSkill::where('user_id', $this->user_id)->get(); // Get this users UserSkills once, to avoid repeated db calls.

        // Restore soft-deleted experience-skills which need to be connected.
        ExperienceSkill::onlyTrashed()
            ->where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereIn('skill_id', $skillIds);
            })
            ->with('userSkill')
            ->restore();

        // Now get existing pivots (for updating details)
        $existingExperienceSkills = ExperienceSkill::where('experience_id', $this->id)
            ->whereHas('userSkill', function ($query) use ($skillIds) {
                $query->whereIn('skill_id', $skillIds);
            })
            ->with('userSkill')
            ->get();

        // We can't use the userSkills()->sync() operation because it will hard-delete ExperienceSkills, so loop through manually.
        foreach ($skills as $newSkill) {
            $newSkill = collect($newSkill);
            $existingPivot = $existingExperienceSkills->firstWhere('userSkill.skill_id', $newSkill->get('id'));
            if ($existingPivot) { // If pivot already exists, update details
                if ($newSkill->has('details')) { // Only update details if it was defined in the input args
                    $existingPivot->details = $newSkill->get('details');
                    $existingPivot->save();
                }
            } else { // If pivot doesn't exist yet, create it
                $userSkillId = $userSkills->where('skill_id', $newSkill->get('id'))->first()->id;
                $detailsArray = $newSkill->only('details')->toArray();
                $this->userSkills()->attach($userSkillId, $detailsArray);
            }
        }
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }

    public function disconnectSkills($skillIds)
    {
        if ($skillIds === null) {
            return; // Just like the Eloquent sync operation, null will be ignored instead of overwriting existing values.
        }
        // Find the userSkills that correspond to these skills.
        $userSkillIds = $this->user->userSkills()->whereIn('skill_id', $skillIds)->pluck('id');
        // Soft-delete these experience-skills
        ExperienceSkill::where('experience_id', $this->id)
            ->whereIn('user_skill_id', $userSkillIds)
            ->delete();
        // If this experience instance continues to be used, ensure the in-memory instance is updated.
        $this->refresh();
    }
}
