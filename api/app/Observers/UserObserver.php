<?php

namespace App\Observers;

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

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        $oldContactEmail = $user->getOriginal('email');
        $newContactEmail = $user->email;
        if ($newContactEmail != $oldContactEmail && ! is_null($user->email_verified_at)) {
            $user->email_verified_at = null;
        }

        $oldWorkEmail = $user->getOriginal('work_email');
        $newWorkEmail = $user->work_email;
        if ($newWorkEmail != $oldWorkEmail && ! is_null($user->work_email_verified_at)) {
            $user->work_email_verified_at = null;
        }

        $user->saveQuietly();
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
