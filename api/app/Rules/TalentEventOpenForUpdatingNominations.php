<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\TalentNomination;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;

class TalentEventOpenForUpdatingNominations implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ((bool) $value) {
            $nomination = TalentNomination::find($value)->load('talentNominationEvent');
            $eventClosing = $nomination->talentNominationEvent->close_date;

            if ((bool) $eventClosing) {
                $now = Carbon::now();

                if ($now > $eventClosing) {
                    $user = Auth::user();

                    // Allow community coordinators and admins to update nominations for past events
                    if ($user && $user->roles()->whereIn('name', ['community_talent_coordinator', 'community_admin'])->exists()) {
                        return;
                    }

                    $fail(ErrorCode::TALENT_EVENT_IS_CLOSED->name);
                }
            }
        }
    }
}
