<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum GovContractorRoleSeniority
{
    use HasLocalization;

    case INTERN_COOP;
    case JUNIOR;
    case INTERMEDIATE;
    case SENIOR;
    case TEAM_LEAD_MANAGER;
    case EXECUTIVE;
    case SENIOR_EXECUTIVE;

    public static function getLangFilename(): string
    {
        return 'gov_contractor_role_seniority';
    }
}
