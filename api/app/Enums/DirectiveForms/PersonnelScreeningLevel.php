<?php

namespace App\Enums\DirectiveForms;

enum PersonnelScreeningLevel
{
    case RELIABILITY;
    case ENHANCED_RELIABILITY;
    case SECRET;
    case TOP_SECRET;
    case OTHER;
}
