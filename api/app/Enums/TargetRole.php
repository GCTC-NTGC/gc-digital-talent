<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TargetRole
{
    use HasLocalization;

    case INDIVIDUAL_CONTRIBUTOR;
    case MANAGER;
    case DIRECTOR;
    case SENIOR_DIRECTOR;
    case DIRECTOR_GENERAL;
    case EXECUTIVE_DIRECTOR;
    case ASSISTANT_DEPUTY_MINISTER;
    case DEPUTY_MINISTER;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'target_role';
    }
}
