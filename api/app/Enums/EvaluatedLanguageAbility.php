<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EvaluatedLanguageAbility
{
    use HasLocalization;

    case X;
    case A;
    case B;
    case C;
    case E;
    case P;
    case NOT_ASSESSED;

    public static function getLangFilename(): string
    {
        return 'evaluated_language_ability';
    }
}
