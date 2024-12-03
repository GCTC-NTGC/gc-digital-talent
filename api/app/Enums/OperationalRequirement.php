<?php

namespace App\Enums;

use App\Traits\HasLocalization;
use GraphQL\Type\Definition\Description;

#[Description(description: 'e.g. Overtime as Required, Shift Work, Travel as Required, etc.')]
enum OperationalRequirement
{
    use HasLocalization;

    case SHIFT_WORK;
    case ON_CALL;
    case TRAVEL;
    case TRANSPORT_EQUIPMENT;
    case DRIVERS_LICENSE;
    case OVERTIME_OCCASIONAL;
    case OVERTIME_REGULAR;

    public static function getLangFilename(): string
    {
        return 'operational_requirement';
    }
}
