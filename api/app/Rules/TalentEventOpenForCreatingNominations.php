<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\TalentNominationEvent;
use App\Models\User;
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
                    /** @var User | null */
                    $user = Auth::user();

                    if ((bool) $user) {
                        $communityTeam = $event->community?->team;

                        if ((bool) $communityTeam && $user->isAbleTo('create-own-pastTalentNomination', $communityTeam)) {
                            return;
                        }
                    }

                    $fail(ErrorCode::TALENT_EVENT_IS_CLOSED->name);
                }
            }
        }
    }
}
