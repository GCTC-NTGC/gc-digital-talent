<?php

namespace App\Observers;

use App\Enums\WfaInterest;
use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        //
    }

    public function updating(User $user)
    {
        $interestDirty = $user->isDirty('wfa_interest');
        $wfaDateDirty = $user->isDirty('wfa_date');

        if ($interestDirty || $wfaDateDirty) {
            if ($interestDirty) {
                $interest = $user->wfa_interest;

                if (is_null($interest) || $interest === WfaInterest::NOT_APPLICABLE->name || $interest === WfaInterest::VOLUNTARY_DEPARTURE->name) {
                    $user->wfa_date = null;
                }
            }
            $user->wfa_updated_at = now();
        }

    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
