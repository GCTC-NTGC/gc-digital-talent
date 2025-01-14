<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ExecCoaching
{
    use HasLocalization;

    case COACHING;
    case LEARNING;

    public static function getLangFilename(): string
    {
        return 'exec_coaching';
    }
}
