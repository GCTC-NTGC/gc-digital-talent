<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PlacementType
{
    use HasLocalization;

    case NOT_PLACED;
    case UNDER_CONSIDERATION;
    case PLACED_TENTATIVE;
    case PLACED_ACTING;
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
            PlacementType::PLACED_ACTING->name,
        ];
    }

    public static function hiredGroup(): array
    {
        return [
            PlacementType::PLACED_INDETERMINATE->name,
        ];
    }

    public static function searchable(): array
    {
        return [
            PlacementType::NOT_PLACED->name,
            PlacementType::PLACED_TENTATIVE->name,
            PlacementType::PLACED_CASUAL->name,
            PlacementType::PLACED_TERM->name,
            PlacementType::PLACED_ACTING->name,
        ];
    }

    public static function hasPlacedStartDate(string $typeName): bool
    {
        return $typeName !== self::NOT_PLACED->name &&
            $typeName !== self::UNDER_CONSIDERATION->name &&
            $typeName !== self::PLACED_TENTATIVE->name;
    }

    public static function getLangFilename(): string
    {
        return 'placement_type';
    }
}
