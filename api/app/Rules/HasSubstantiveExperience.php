<?php

namespace App\Rules;

use App\Enums\WfaInterest;
use App\Models\User;
use Closure;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Contracts\Validation\ValidationRule;

class HasSubstantiveExperience implements ValidationRule
{
    protected $wfaInterest;

    public function __construct($wfaInterest)
    {
        $this->wfaInterest = $wfaInterest;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::find($value);
        $ruleApplies = ! is_null($this->wfaInterest) && $this->wfaInterest !== WfaInterest::NOT_APPLICABLE->name;

        if ($user && $ruleApplies) {
            $expCount = $user->current_substantive_experiences->count();

            if (! $expCount) {
                $fail(ApiErrorEnums::MISSING_SUBSTANTIVE_EXPERIENCE);
            }

            if ($expCount > 1) {
                $fail(ApiErrorEnums::TOO_MANY_SUBSTANTIVE_EXPERIENCES);
            }
        }
    }
}
