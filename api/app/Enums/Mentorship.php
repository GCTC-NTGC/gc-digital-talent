<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum Mentorship
{
    use HasLocalization;

    case MENTOR;
    case MENTEE;

    public static function getLangFilename(): string
    {
        return 'mentorship';
    }
}
