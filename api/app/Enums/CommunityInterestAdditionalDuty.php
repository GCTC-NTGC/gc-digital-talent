<?php

namespace App\Enums;

use App\Traits\HasLocalization;

// Additional duties selectable for community interests
enum CommunityInterestAdditionalDuty
{
    use HasLocalization;

    case CORPORATE_COMMUNICATIONS;
    case FACILITIES_MANAGEMENT_AND_SECURITY;
    case HUMAN_RESOURCES;
    case INFORMATION_TECHNOLOGY;
    case MATERIEL_MANAGEMENT;
    case PROCUREMENT;
    case PROJECT_MANAGEMENT;
    case REAL_PROPERTY_MANAGEMENT;

    public static function getLangFilename(): string
    {
        return 'community_interest_additional_duty';
    }
}
