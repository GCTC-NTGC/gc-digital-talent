<?php

namespace App\Enums\DirectiveForms;

enum ContractFteRange
{
    case FROM_1_TO_5;
    case FROM_6_TO_10;
    case FROM_11_TO_30;
    case FROM_31_TO_50;
    case FROM_51_TO_100;
    case GREATER_THAN_100;
}
