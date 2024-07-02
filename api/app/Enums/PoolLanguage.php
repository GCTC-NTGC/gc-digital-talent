<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolLanguage
{
    use HasLocalization;

    case ENGLISH;
    case FRENCH;
    case VARIOUS;
    case BILINGUAL_INTERMEDIATE;
    case BILINGUAL_ADVANCED;

    public static function getLangFilename(): string
    {
        return 'pool_language';
    }
}
