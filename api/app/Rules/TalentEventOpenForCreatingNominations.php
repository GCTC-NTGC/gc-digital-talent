<?php

namespace App\Rules;

use App\Models\TalentNominationEvent;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

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
                    $fail('TalentEventIsClosed');
                }
            }
        }
    }
}
