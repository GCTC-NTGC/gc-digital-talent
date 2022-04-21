<?php

namespace Database\Helpers;

// TODO: any way to pull these directly from the graphql schema?
class ApiEnums
{
    /**
     * A collection of enums for operation_requirement in factories and seeders
     *
     * @return string[]
     */
    public static function operationalRequirements() : array
    {
        return [
            'SHIFT_WORK',
            'ON_CALL',
            'TRAVEL',
            'TRANSPORT_EQUIPMENT',
            'DRIVERS_LICENSE',
            'WORK_WEEKENDS',
            'OVERTIME_SCHEDULED',
            'OVERTIME_SHORT_NOTICE'
        ];
    }


    const LANGUAGE_ABILITY_ENGLISH = 'ENGLISH';
    const LANGUAGE_ABILITY_FRENCH = 'FRENCH';
    const LANGUAGE_ABILITY_BILINGUAL = 'BILINGUAL';
    /**
     * A collection of enums for LanguageAbility in factories and seeders
     *
     * @return string[]
     */
    public static function languageAbilities() : array
    {
        return [
            self::LANGUAGE_ABILITY_ENGLISH,
            self::LANGUAGE_ABILITY_FRENCH,
            self::LANGUAGE_ABILITY_BILINGUAL,
        ];
    }
}
