<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentNominationEventStatus
{
    use HasLocalization;

    case ACTIVE;
    case UPCOMING;
    case PAST;

    public static function getLangFilename(): string
    {
        return 'talent_nomination_event_status';
    }
}
