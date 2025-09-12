<?php

namespace App\Observers;

use App\Models\EmployeeWFA;

class EmployeeWFAObserver
{
    public function updated(EmployeeWFA $employeeWFA)
    {
        $newInterest = $employeeWFA->wfa_interest;

        if (is_null($newInterest)) {
            $employeeWFA->wfa_date = null;
        }

        $employeeWFA->wfa_updated_at = now();

        $employeeWFA->saveQuietly();
    }
}
