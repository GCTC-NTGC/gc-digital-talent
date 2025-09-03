<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ErrorCode
{
    use HasLocalization;

    case INVALID_STATUS_REVERT_FINAL_DECISION;
    case APPLICATION_EXISTS;

    public static function getLangFilename(): string
    {
        return 'error_code';
    }

    public function localized(?string $locale = null): string
    {
        return self::localizedString($this->name)[$locale ?? 'localized'] ?? $this->name;
    }
}
