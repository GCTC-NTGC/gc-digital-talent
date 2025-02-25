<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum OrganizationTypeInterest
{
    use HasLocalization;

    case CURRENT;
    case CPA;
    case NON_CPA;
    case CENTRAL_AGENCIES;
    case ANY;

    public static function getLangFilename(): string
    {
        return 'organization_type_interest';
    }
}
