<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\TalentNomination;
use App\Models\User;
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
            $nomination = TalentNomination::with('talentNominationEvent')->find($value);
            $eventClosing = $nomination?->talentNominationEvent?->close_date;

            if ((bool) $eventClosing) {
                $now = Carbon::now();

                if ($now > $eventClosing) {
                    /** @var User | null */
                    $user = Auth::user();

                    if ((bool) $user) {
                        $communityTeam = $nomination->talentNominationEvent?->community?->team;

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
