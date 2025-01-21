<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum DeadlineStatus
{
    use HasLocalization;

    case PUBLISHED;
    case EXPIRED;

    public static function getLangFilename(): string
    {
        return 'deadline_status';
    }
}
