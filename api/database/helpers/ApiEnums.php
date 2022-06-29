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

    const GOV_EMPLOYEE_TYPE_STUDENT = 'STUDENT';
    const GOV_EMPLOYEE_TYPE_CASUAL = 'CASUAL';
    const GOV_EMPLOYEE_TYPE_TERM = 'TERM';
    const GOV_EMPLOYEE_TYPE_INDETERMINATE = 'INDETERMINATE';
    /**
     * A collection of enums for LanguageAbility in factories and seeders
     *
     * @return string[]
     */
    public static function govEmployeeTypes() : array
    {
        return [
            self::GOV_EMPLOYEE_TYPE_STUDENT,
            self::GOV_EMPLOYEE_TYPE_CASUAL,
            self::GOV_EMPLOYEE_TYPE_TERM,
            self::GOV_EMPLOYEE_TYPE_INDETERMINATE,
        ];
    }

    const CANDIDATE_EXPIRY_FILTER_ACTIVE = 'ACTIVE';
    const CANDIDATE_EXPIRY_FILTER_EXPIRED = 'EXPIRED';
    const CANDIDATE_EXPIRY_FILTER_ALL = 'ALL';

    const ROLE_ADMIN = 'ADMIN';
    const ROLE_APPLICANT = 'APPLICANT';
    /**
     * A collection of enums for Role in factories and seeders
     *
     * @return string[]
     */
    public static function roles() : array
    {
        return [
            self::ROLE_ADMIN,
            self::ROLE_APPLICANT,
        ];
    }

    /**
     * A collection of enums for salary ranges in factories and seeders
     *
     * @return string[]
     */
    public static function salaryRanges() : array
    {
        return [
            '_50_59K',
            '_60_69K',
            '_70_79K',
            '_80_89K',
            '_90_99K',
            '_100K_PLUS',
        ];
    }

    const CANDIDATE_STATUS_AVAILABLE = 'AVAILABLE';
    const CANDIDATE_STATUS_PLACED_INDETERMINATE = 'PLACED_INDETERMINATE';
    const CANDIDATE_STATUS_PLACED_TERM = 'PLACED_TERM';
    const CANDIDATE_STATUS_NO_LONGER_INTERESTED = 'NO_LONGER_INTERESTED';
    const CANDIDATE_STATUS_UNAVAILABLE = 'UNAVAILABLE';
    const CANDIDATE_STATUS_EXPIRED = 'EXPIRED';
    const CANDIDATE_STATUS_PLACED_CASUAL = 'PLACED_CASUAL';

    public static function candidateStatuses() : array
    {
        return [
            self::CANDIDATE_STATUS_AVAILABLE,
            self::CANDIDATE_STATUS_PLACED_INDETERMINATE,
            self::CANDIDATE_STATUS_PLACED_TERM,
            self::CANDIDATE_STATUS_NO_LONGER_INTERESTED,
            self::CANDIDATE_STATUS_UNAVAILABLE,
            self::CANDIDATE_STATUS_EXPIRED,
            self::CANDIDATE_STATUS_PLACED_CASUAL,
        ];
    }

    const USER_STATUS_ACTIVELY_LOOKING = 'ACTIVELY_LOOKING';
    const USER_STATUS_OPEN_TO_OPPORTUNITIES = 'OPEN_TO_OPPORTUNITIES';
    const USER_STATUS_INACTIVE = 'INACTIVE';

    const POOL_STATUS_NOT_TAKING_APPLICATIONS = 'NOT_TAKING_APPLICATIONS';
    const POOL_STATUS_TAKING_APPLICATIONS = 'TAKING_APPLICATIONS';

    /**
     * A collection of enums for pool statuses in factories and seeders
     *
     * @return string[]
     */
    public static function poolStatuses() : array
    {
        return [
            self::POOL_STATUS_NOT_TAKING_APPLICATIONS,
            self::POOL_STATUS_TAKING_APPLICATIONS,
        ];
    }

    const GENERIC_JOB_TITLE_KEY_TECHNICIAN_IT01 = 'TECHNICIAN_IT01';
    const GENERIC_JOB_TITLE_KEY_ANALYST_IT02 = 'ANALYST_IT02';
    const GENERIC_JOB_TITLE_KEY_TEAM_LEADER_IT03 = 'TEAM_LEADER_IT03';
    const GENERIC_JOB_TITLE_KEY_TECHNICAL_ADVISOR_IT03 = 'TECHNICAL_ADVISOR_IT03';
    const GENERIC_JOB_TITLE_KEY_SENIOR_ADVISOR_IT04 = 'SENIOR_ADVISOR_IT04';
    const GENERIC_JOB_TITLE_KEY_MANAGER_IT04 = 'MANAGER_IT04';
    /**
     * A collection of enums for GenericJobTitles in factories and seeders
     *
     * @return string[]
     */
    public static function genericJobTitleKeys() : array
    {
        return [
            self::GENERIC_JOB_TITLE_KEY_TECHNICIAN_IT01,
            self::GENERIC_JOB_TITLE_KEY_ANALYST_IT02,
            self::GENERIC_JOB_TITLE_KEY_TEAM_LEADER_IT03,
            self::GENERIC_JOB_TITLE_KEY_TECHNICAL_ADVISOR_IT03,
            self::GENERIC_JOB_TITLE_KEY_SENIOR_ADVISOR_IT04,
            self::GENERIC_JOB_TITLE_KEY_MANAGER_IT04,
        ];
    }
}
