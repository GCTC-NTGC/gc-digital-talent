<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class GovernmentEmailRegex implements ValidationRule
{
    // Note: Should be kept in sync with the workEmailDomainRegex
    public const PATTERN =
        '/@([A-Za-z0-9-]+\.)*(gc\.ca|canada\.ca|elections\.ca|ccc\.ca|canadapost-postescanada\.ca|gg\.ca|scics\.ca|scc-csc\.ca|ccohs\.ca|cchst\.ca|edc\.ca|invcanada\.ca|parl\.ca|telefilm\.ca|bankofcanada\.ca|banqueducanada\.ca|ncc-ccn\.ca|bank-banque-canada\.ca|cef-cce\.ca|cgc\.ca|nfb\.ca|onf\.ca|canadacouncil\.ca|conseildesarts\.ca|humanrights\.ca|droitsdelapersonne\.ca|ingeniumcanada\.org|cjc-ccm\.ca|bdc\.ca|idrc\.ca|museedelhistoire\.ca|historymuseum\.ca|cdic\.ca|sadc\.ca|scc\.ca|clc\.ca|clc-sic\.ca|cntower\.ca|latourcn\.ca)$/i';

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        if (! preg_match(self::PATTERN, $value)) {
            $fail(ErrorCode::NOT_GOVERNMENT_EMAIL->name);
        }
    }
}
