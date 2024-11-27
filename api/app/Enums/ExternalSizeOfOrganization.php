<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ExternalSizeOfOrganization
{
    use HasLocalization;

    case ONE_TO_THIRTY_FIVE;
    case THIRTY_SIX_TO_ONE_HUNDRED;
    case ONE_HUNDRED_ONE_TO_ONE_THOUSAND;
    case ONE_THOUSAND_PLUS;

    public static function getLangFilename(): string
    {
        return 'ext_size_of_organization';
    }
}
