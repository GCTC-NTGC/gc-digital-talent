<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ScreeningStage
{
    use HasLocalization;

    case NEW_APPLICATION;
    case APPLICATION_REVIEW;
    case SCREENED_IN;
    case UNDER_ASSESSMENT;

    public static function getLangFilename(): string
    {
        return 'screening_stage';
    }
}
