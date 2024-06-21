<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum GenericJobTitleKey
{
    use HasLocalization;

    case TECHNICIAN_IT01;
    case ANALYST_IT02;
    case TEAM_LEADER_IT03;
    case TECHNICAL_ADVISOR_IT03;
    case SENIOR_ADVISOR_IT04;
    case MANAGER_IT04;
    case EXECUTIVE_EX03;

    public static function getLangFilename(): string
    {
        return 'generic_job_title_key';
    }
}
