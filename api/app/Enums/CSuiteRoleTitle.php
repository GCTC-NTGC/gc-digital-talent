<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CSuiteRoleTitle
{
    use HasLocalization;

    case CHIEF_AUDIT_OFFICER;
    case CHIEF_FINANCE_OFFICER;
    case CHIEF_DATA_OFFICER;
    case CHIEF_DIGITAL_OFFICER;
    case CHIEF_INFORMATION_OFFICER;
    case CHIEF_PRIVACY_OFFICER;
    case CHIEF_TECHNOLOGY_OFFICER;
    case DEPUTY_CHIEF_AUDIT_OFFICER;
    case DEPUTY_CHIEF_FINANCE_OFFICER;
    case DEPUTY_CHIEF_DATA_OFFICER;
    case DEPUTY_CHIEF_DIGITAL_OFFICER;
    case DEPUTY_CHIEF_INFORMATION_OFFICER;
    case DEPUTY_CHIEF_PRIVACY_OFFICER;
    case DEPUTY_CHIEF_TECHNOLOGY_OFFICER;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'c_suite_role_title';
    }
}
