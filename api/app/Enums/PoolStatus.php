<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolStatus
{
    use HasLocalization;

    case DRAFT;
    case PUBLISHED;
    case CLOSED;
    case ARCHIVED;

    public static function getLangFilename(): string
    {
        return 'pool_status';
    }
}
