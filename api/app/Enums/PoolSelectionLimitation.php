<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolSelectionLimitation
{
    use HasLocalization;

    case AT_LEVEL_ONLY;
    case DEPARTMENTAL_PREFERENCE;
    case CANADIAN_CITIZENS;

    public static function getLangFilename(): string
    {
        return 'pool_selection_limitation';
    }

    /**
     * @return array<int, PoolSelectionLimitation>
     */
    public static function limitationsForEmployees(): array
    {
        return [
            PoolSelectionLimitation::AT_LEVEL_ONLY,
            PoolSelectionLimitation::DEPARTMENTAL_PREFERENCE,
        ];
    }

    /**
     * @return array<int, PoolSelectionLimitation>
     */
    public static function limitationsForPublic(): array
    {
        return [
            PoolSelectionLimitation::CANADIAN_CITIZENS,
        ];
    }
}
