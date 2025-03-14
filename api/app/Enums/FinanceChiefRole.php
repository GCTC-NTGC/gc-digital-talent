<?php

namespace App\Enums;

// Additional roles that a CFO or DCFO may have
enum FinanceChiefRole
{
    case CHIEF_SECURITY_OFFICER;
    case CHIEF_INFORMATION_OFFICER;
    case HEAD_OF_HUMAN_RESOURCES;
    case HEAD_OF_PROCUREMENT;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'finance_chief_role';
    }
}
