<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum DevelopmentProgramParticipationStatus
{
    use HasLocalization;

    case NOT_INTERESTED;
    case INTERESTED;
    case ENROLLED;
    case COMPLETED;

    public static function getLangFilename(): string
    {
        return 'development_program_participation_status';
    }
}
