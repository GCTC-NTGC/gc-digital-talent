<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum OrganizationTypeInterest
{
    use HasLocalization;

    case CURRENT;
    case OTHER_DEPARTMENT;
    case OTHER_AGENCY;
    case OTHER_CROWN_CORP;

    public static function getLangFilename(): string
    {
        return 'organization_type_interest';
    }
}
