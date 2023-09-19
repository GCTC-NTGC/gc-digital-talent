<?php

namespace App\Enums;

enum AwardedScope
{
    case INTERNATIONAL;
    case NATIONAL;
    case PROVINCIAL;
    case LOCAL;
    case COMMUNITY;
    case ORGANIZATIONAL;
    case SUB_ORGANIZATIONAL;
}
