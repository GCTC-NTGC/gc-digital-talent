<?php

namespace App\Enums;

enum IndigenousCommunity
{
    case STATUS_FIRST_NATIONS;
    case NON_STATUS_FIRST_NATIONS;
    case INUIT;
    case METIS;
    case OTHER;
    case LEGACY_IS_INDIGENOUS;
}
