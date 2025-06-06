<?php

namespace App\Rules;

use App\Models\TalentNomination;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

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
                    $fail('TalentEventIsClosed');
                }
            }
        }
    }
}
