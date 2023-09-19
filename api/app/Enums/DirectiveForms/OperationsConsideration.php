<?php

namespace App\Enums\DirectiveForms;

enum OperationsConsideration
{
    case FINANCE_VEHICLE_NOT_USABLE;
    case FUNDING_SECURED_COST_RECOVERY_BASIS;
    case UNABLE_CREATE_NEW_INDETERMINATE;
    case UNABLE_CREATE_NEW_TERM;
    case UNABLE_CREATE_CLASSIFICATION_RESTRICTION;
    case STAFFING_FREEZE;
    case OTHER;
}
