<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ProvinceOrTerritory
{
    use HasLocalization;

    case BRITISH_COLUMBIA;
    case ALBERTA;
    case SASKATCHEWAN;
    case MANITOBA;
    case ONTARIO;
    case QUEBEC;
    case NEW_BRUNSWICK;
    case NOVA_SCOTIA;
    case PRINCE_EDWARD_ISLAND;
    case NEWFOUNDLAND_AND_LABRADOR;
    case YUKON;
    case NORTHWEST_TERRITORIES;
    case NUNAVUT;

    public static function getLangFilename(): string
    {
        return 'province_or_territory';
    }
}
