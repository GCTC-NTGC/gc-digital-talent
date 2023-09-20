<?php

namespace App\Enums\DirectiveForms;

enum ContractValueRange
{
    case FROM_0_TO_10K;
    case FROM_10K_TO_25K;
    case FROM_25K_TO_50K;
    case FROM_50K_TO_1M;
    case FROM_1M_TO_2500K;
    case FROM_2500K_TO_5M;
    case FROM_5M_TO_10M;
    case FROM_10M_TO_15M;
    case FROM_15M_TO_25M;
    case GREATER_THAN_25M;
}
