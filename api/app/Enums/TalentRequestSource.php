<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestSource
{
    use HasLocalization;

    case QUALIFIED_IN_POOL;
    case AT_LEVEL;
    case ADVANCEMENT;

    public static function getLangFilename(): string
    {
        return 'talent_request_source';
    }
}
