<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PlacementType
{
    use HasLocalization;

    case NOT_PLACED;
    case UNDER_CONSIDERATION;
    case PLACED_TENTATIVE;
    case PLACED_CASUAL;
    case PLACED_TERM;
    case PLACED_INDETERMINATE;

    public static function openToJobsGroup(): array
    {
        return [
            PlacementType::NOT_PLACED->name,
            PlacementType::UNDER_CONSIDERATION->name,
            PlacementType::PLACED_TENTATIVE->name,
            PlacementType::PLACED_CASUAL->name,
            PlacementType::PLACED_TERM->name,
        ];
    }

    public static function hiredGroup(): array
    {
        return [
            PlacementType::PLACED_INDETERMINATE->name,
        ];
    }

    public static function getLangFilename(): string
    {
        return 'placement_type';
    }
}
