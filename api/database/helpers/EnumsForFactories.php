<?php

namespace Database\Helpers;

// TODO: any way to pull these directly from the graphql schema?
class EnumsForFactories
{
    /**
     * A collection of enums for operation_requirement in factories and seeders
     *
     * @return string[]
     */
    public static function operationalRequirements() : array
    {
        return [
            'OVERTIME',
            'SHIFT_WORK',
            'ON_CALL',
            'TRAVEL',
            'TRANSPORT_EQUIPMENT',
            'DRIVERS_LICENSE',
        ];
    }
}
