<?php

namespace App\Enums\DirectiveForms;

enum PersonnelOtherRequirement
{
    case SHIFT_WORK;
    case ON_CALL_24_7;
    case OVERTIME_SHORT_NOTICE;
    case AS_NEEDED;
    case OTHER;
}
