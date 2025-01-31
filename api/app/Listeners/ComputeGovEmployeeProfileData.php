<?php

namespace App\Listeners;

use App\Enums\EmploymentCategory;
use App\Enums\GovPositionType;
use App\Enums\WorkExperienceGovEmployeeType;
use App\Events\WorkExperienceSaved;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ComputeGovEmployeeProfileData
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    private $employmentTypeOrder = [
        WorkExperienceGovEmployeeType::INDETERMINATE->name,
        WorkExperienceGovEmployeeType::TERM->name,
        WorkExperienceGovEmployeeType::CASUAL->name,
    ];

    private $positionTypeOrder = [
        GovPositionType::ACTING->name,
        GovPositionType::SECONDMENT->name,
        GovPositionType::ASSIGNMENT->name,
        GovPositionType::SUBSTANTIVE->name,
    ];

    /**
     * Handle the event.
     */
    public function handle(WorkExperienceSaved $event): void
    {
        $workExperience = $event->workExperience;
        $user = $workExperience->user;

        $currentExperiences = WorkExperience::where('user_id', $user->id)
            ->whereIn('properties->employment_category', [EmploymentCategory::GOVERNMENT_OF_CANADA->name, EmploymentCategory::CANADIAN_ARMED_FORCES->name])
            ->whereNotIn('properties->gov_employment_type', [WorkExperienceGovEmployeeType::STUDENT->name, WorkExperienceGovEmployeeType::CONTRACTOR->name])
            ->where(function (Builder $query) {
                $query->whereNull('properties->end_date')
                    ->orWhere('properties->end_date', '>=', now());
            })
            ->orderBy('properties->start_date', 'DESC')
            ->get();

        if (! $currentExperiences->count()) {
            Log::info([
                'computed_is_gov_employee' => false,
            ]);

            return;
        }

        $latest = $currentExperiences->first();
        $startDate = Carbon::parse($latest->start_date);
        $sameStartDate = $currentExperiences->where(function ($experience) use ($startDate) {
            // Is same month and year
            return $startDate->isSameMonth($experience->start_date, true);
        });

        if ($sameStartDate->count()) {
            $priortySortedExperiences = $sameStartDate
                ->sortBy('created_at')
                ->sortBy([
                    fn (WorkExperience $a, WorkExperience $b) => array_search($a?->gov_employment_type, $this->employmentTypeOrder) <=> array_search($b?->gov_employment_type, $this->employmentTypeOrder),
                    fn (WorkExperience $a, WorkExperience $b) => array_search($a?->gov_position_type, $this->positionTypeOrder) <=> array_search($b?->gov_position_type, $this->positionTypeOrder),
                ]);

            $latest = $priortySortedExperiences->first();
        }

        Log::info([
            'latest' => $this->logTransform($latest),
            'priority' => $priortySortedExperiences->map(fn ($exp) => $this->logTransform($exp)),
            'current' => $currentExperiences->map(fn ($exp) => $this->logTransform($exp)),
        ]);
    }

    private function logTransform(WorkExperience $exp)
    {
        return [
            'title' => $exp->getTitle(),
            'start_date' => $exp->start_date?->toDateString(),
            'end_date' => $exp?->end_date ? $exp->end_date->toDateString() : 'null',
            'type' => $exp->gov_employment_type,
            'position' => $exp->gov_position_type,
            'category' => $exp->employment_category,
            'created_at' => $exp->created_at?->toDateString(),
        ];
    }
}
