<?php

namespace App\Enums;

use GraphQL\Type\Definition\Description;

#[Description(description: 'e.g. Overtime as Required, Shift Work, Travel as Required, etc.')]
enum OperationalRequirement
{
    case SHIFT_WORK;
    case ON_CALL;
    case TRAVEL;
    case TRANSPORT_EQUIPMENT;
    case DRIVERS_LICENSE;
    case OVERTIME_OCCASIONAL;
    case OVERTIME_REGULAR;
}
