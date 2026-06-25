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

    // the User relation holding this source's matched records, or null if not implemented yet
    public function matchRelation(): ?string
    {
        return match ($this) {
            self::QUALIFIED_IN_POOL => 'matchingQualifiedInPoolSources',
            default => null,
        };
    }
}
