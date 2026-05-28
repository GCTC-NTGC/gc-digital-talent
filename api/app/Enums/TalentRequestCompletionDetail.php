<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestCompletionDetail
{
    use HasLocalization;

    case HIRE_MADE;
    case PROCESS_WILL_BE_LAUNCHED;
    case HIRING_MANAGER_NOT_RESPONSIVE;
    case NO_CANDIDATES_FOUND;
    case NO_LONGER_REQUIRED;
    case DUPLICATE_REQUEST;
    case NON_COMPLIANT;

    public static function getLangFilename(): string
    {
        return 'talent_request_completion_detail';
    }
}
