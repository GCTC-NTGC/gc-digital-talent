<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum GovContractorType
{
    use HasLocalization;

    case SELF_EMPLOYED;
    case FIRM_OR_AGENCY;

    public static function getLangFilename(): string
    {
        return 'gov_contractor_type';
    }
}
