<?php

namespace App\Enums;

use App\Traits\HasLocalization;

// Additional duties that a CFO or DCFO may have
enum FinanceChiefDuty
{
    use HasLocalization;

    case CORPORATE_COMMUNICATIONS;
    case FACILITIES_MANAGEMENT_AND_SECURITY;
    case HUMAN_RESOURCES;
    case INFORMATION_TECHNOLOGY;
    case MATERIEL_MANAGEMENT;
    case PROCUREMENT;
    case REAL_PROPERTY_MANAGEMENT;

    public static function getLangFilename(): string
    {
        return 'finance_chief_duty';
    }
}
