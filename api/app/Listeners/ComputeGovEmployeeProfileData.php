<?php

namespace App\Listeners;

use App\Events\WorkExperienceSaved;

class ComputeGovEmployeeProfileData
{
    public function __construct() {}

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

        $latest = $user->latest_current_government_work_experience;

        if (! $latest) {
            $user->update([
                'computed_is_gov_employee' => false,
                'computed_gov_employee_type' => null,
                'computed_classification' => null,
                'computed_department' => null,
                'computed_gov_position_type' => null,
                'computed_gov_end_date' => null,
                'computed_gov_role' => null,
            ]);

            return;
        }

        $user->update([
            'computed_is_gov_employee' => true,
            'computed_gov_employee_type' => $latest?->gov_employment_type,
            'computed_classification' => $latest?->classification_id,
            'computed_department' => $latest?->department_id,
            'computed_gov_position_type' => $latest?->gov_position_type,
            'computed_gov_end_date' => $latest?->end_date,
            'computed_gov_role' => $latest?->role,
        ]);
    }
}
