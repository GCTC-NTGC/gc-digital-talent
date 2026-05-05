<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolLanguage
{
    use HasLocalization;

    case ENGLISH;
    case FRENCH;
    case VARIOUS;
    case VARIOUS_BILINGUAL;
    case BILINGUAL_INTERMEDIATE;
    case BILINGUAL_ADVANCED;

    public static function bilingualGroup(): array
    {
        return [
            PoolLanguage::VARIOUS_BILINGUAL->name,
            PoolLanguage::BILINGUAL_INTERMEDIATE->name,
            PoolLanguage::BILINGUAL_ADVANCED->name,
        ];
    }

    public static function getLangFilename(): string
    {
        return 'pool_language';
    }
}
