<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class GovernmentEmailRegex implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Note: Should be kept in sync with the workEmailDomainRegex
        $governmentEmailRegex =
        '/@([A-Za-z0-9-]+\.)*(gc\.ca|canada\.ca|elections\.ca|ccc\.ca|canadapost-postescanada\.ca|gg\.ca|scics\.ca|scc-csc\.ca|ccohs\.ca|cchst\.ca|edc\.ca|invcanada\.ca|parl\.ca|telefilm\.ca|bankofcanada\.ca|banqueducanada\.ca|ncc-ccn\.ca|bank-banque-canada\.ca|cef-cce\.ca|cgc\.ca|nfb\.ca|onf\.ca|canadacouncil\.ca|conseildesarts\.ca|humanrights\.ca|droitsdelapersonne\.ca|ingeniumcanada\.org|cjc-ccm\.ca|bdc\.ca|idrc\.ca|museedelhistoire\.ca|historymuseum\.ca|cdic\.ca|sadc\.ca|scc\.ca|clc\.ca|clc-sic\.ca|cntower\.ca|latourcn\.ca)$/i';

        if (! preg_match($governmentEmailRegex, $value)) {
            $fail(ErrorCode::NOT_GOVERNMENT_EMAIL->name);
        }
    }
}
