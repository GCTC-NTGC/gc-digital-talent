<?php

namespace App\Listeners;

use App\Enums\EmploymentCategory;
use App\Enums\GovPositionType;
use App\Enums\WorkExperienceGovEmployeeType;
use App\Events\WorkExperienceSaved;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class ComputeGovEmployeeProfileData
{
    public function __construct() {}

    private $employmentTypeOrder = [
        WorkExperienceGovEmployeeType::INDETERMINATE->name,
        WorkExperienceGovEmployeeType::TERM->name,
        null,
    ];

    private $positionTypeOrder = [
        GovPositionType::ACTING->name,
        GovPositionType::SECONDMENT->name,
        GovPositionType::ASSIGNMENT->name,
        GovPositionType::SUBSTANTIVE->name,
        null,
    ];

    /**
     * Handle the event.
     */
    public function handle(WorkExperienceSaved $event): void
    {
        $workExperience = $event->workExperience;
        $user = $workExperience->user;

        if (! $user) {
            return;
        }

        $currentExperiences = WorkExperience::where('user_id', $user->id)
            ->whereIn('properties->employment_category', [EmploymentCategory::GOVERNMENT_OF_CANADA->name, EmploymentCategory::CANADIAN_ARMED_FORCES->name])
            ->whereNotIn('properties->gov_employment_type', [
                WorkExperienceGovEmployeeType::STUDENT->name,
                WorkExperienceGovEmployeeType::CASUAL->name,
                WorkExperienceGovEmployeeType::CONTRACTOR->name,
            ])
            ->where(function (Builder $query) {
                $query->whereNull('properties->end_date')
                    ->orWhere('properties->end_date', '>=', now());
            })
            ->orderBy('properties->start_date', 'DESC')
            ->get();

        if (! $currentExperiences->count()) {
            $user->update([
                'computed_is_gov_employee' => false,
                'computed_gov_employee_type' => null,
                'computed_classification' => null,
                'computed_department' => null,
                'computed_gov_position_type' => null,
                'computed_gov_end_date' => null,
            ]);

            return;
        }

        $latest = $currentExperiences->first();
        $startDate = Carbon::parse($latest->start_date);
        $sameStartDate = $currentExperiences->where(function ($experience) use ($startDate) {
            // Is same month and year
            return $experience?->start_date && $startDate->isSameMonth($experience->start_date, true);
        });

        if ($sameStartDate->count()) {
            $prioritySortedExperiences = $sameStartDate
                ->sortBy('created_at')
                ->sortBy([
                    fn (WorkExperience $a, WorkExperience $b) => array_search($a->gov_position_type, $this->positionTypeOrder) <=> array_search($b->gov_position_type, $this->positionTypeOrder),
                    fn (WorkExperience $a, WorkExperience $b) => array_search($a->gov_employment_type, $this->employmentTypeOrder) <=> array_search($b->gov_employment_type, $this->employmentTypeOrder),
                ]);

            $latest = $prioritySortedExperiences->first();
        }

        $user->update([
            'computed_is_gov_employee' => true,
            'computed_gov_employee_type' => $latest?->gov_employment_type,
            'computed_classification' => $latest?->classification_id,
            'computed_department' => $latest?->department_id,
            'computed_gov_position_type' => $latest?->gov_position_type,
            'computed_gov_end_date' => $latest?->end_date,
        ]);
    }
}
