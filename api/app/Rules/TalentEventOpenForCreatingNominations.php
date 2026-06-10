<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\TalentNominationEvent;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;

class TalentEventOpenForCreatingNominations implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $eventId = $value ? $value['talentNominationEvent']['connect'] : null;

        if ((bool) $eventId) {
            $event = TalentNominationEvent::find($eventId);
            $eventClosing = $event?->close_date;

            if ((bool) $eventClosing) {
                $now = Carbon::now();

                if ($now > $eventClosing) {
                    $user = Auth::user();

                    // Allow community coordinators and admins to nominate for past events
                    if ($user->roles()->whereIn('name', ['community_talent_coordinator', 'community_admin'])->exists()) {
                        return;
                    }

                    $fail(ErrorCode::TALENT_EVENT_IS_CLOSED->name);
                }
            }
        }
    }
}
