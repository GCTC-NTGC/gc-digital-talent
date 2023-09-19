<?php

namespace App\Enums\DirectiveForms;

enum ContractStartTimeframe
{
    case FROM_0_TO_3M;
    case FROM_3M_TO_6M;
    case FROM_6M_TO_1Y;
    case FROM_1Y_TO_2Y;
    case UNKNOWN;
    case VARIABLE;
}
