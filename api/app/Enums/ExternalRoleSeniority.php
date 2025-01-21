<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ExternalRoleSeniority
{
    use HasLocalization;

    case INTERN_COOP;
    case JUNIOR;
    case INTERMEDIATE;
    case SENIOR;
    case TEAM_LEAD_MANAGER;
    case EXECUTIVE;
    case SENIOR_EXECUTIVE;
    case SELF_EMPLOYED;

    public static function getLangFilename(): string
    {
        return 'ext_role_seniority';
    }
}
