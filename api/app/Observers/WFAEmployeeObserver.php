<?php

namespace App\Observers;

use App\Models\WFAEmployee;

class WFAEmployeeObserver
{
    public function updated(WFAEmployee $wfaEmployee)
    {
        $newInterest = $wfaEmployee->wfa_interest;

        if (is_null($newInterest)) {
            $wfaEmployee->wfa_date = null;
        }

        $wfaEmployee->wfa_updated_at = now();

        $wfaEmployee->saveQuietly();
    }
}
