<?php

namespace App\Enums;

enum PlacementType
{
    case PLACED_TENTATIVE;
    case PLACED_CASUAL;
    case PLACED_TERM;
    case PLACED_INDETERMINATE;
}
