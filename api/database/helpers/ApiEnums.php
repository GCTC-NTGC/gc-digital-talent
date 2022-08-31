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
            'OVERTIME_SHORT_NOTICE',
            'OVERTIME_OCCASIONAL',
            'OVERTIME_REGULAR',
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
    /**
     * A collection of enums for CandidateExpiryStatus in factories and seeders
     *
     * @return string[]
     */
    public static function candidateExpiryFilters() : array
    {
        return [
            self::CANDIDATE_EXPIRY_FILTER_ACTIVE,
            self::CANDIDATE_EXPIRY_FILTER_EXPIRED,
            self::CANDIDATE_EXPIRY_FILTER_ALL,
        ];
    }

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

    const CANDIDATE_STATUS_DRAFT = 'DRAFT';
    const CANDIDATE_STATUS_DRAFT_EXPIRED = 'DRAFT_EXPIRED';
    const CANDIDATE_STATUS_NEW_APPLICATION = 'NEW_APPLICATION';
    const CANDIDATE_STATUS_APPLICATION_REVIEW = 'APPLICATION_REVIEW';
    const CANDIDATE_STATUS_SCREENED_IN = 'SCREENED_IN';
    const CANDIDATE_STATUS_SCREENED_OUT_APPLICATION = 'SCREENED_OUT_APPLICATION';
    const CANDIDATE_STATUS_UNDER_ASSESSMENT = 'UNDER_ASSESSMENT';
    const CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT = 'SCREENED_OUT_ASSESSMENT';
    const CANDIDATE_STATUS_QUALIFIED_AVAILABLE = 'QUALIFIED_AVAILABLE';
    const CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE = 'QUALIFIED_UNAVAILABLE';
    const CANDIDATE_STATUS_QUALIFIED_WITHDREW = 'QUALIFIED_WITHDREW';
    const CANDIDATE_STATUS_PLACED_CASUAL = 'PLACED_CASUAL';
    const CANDIDATE_STATUS_PLACED_TERM = 'PLACED_TERM';
    const CANDIDATE_STATUS_PLACED_INDETERMINATE = 'PLACED_INDETERMINATE';
    const CANDIDATE_STATUS_EXPIRED = 'EXPIRED';

    public static function candidateStatuses() : array
    {
        return [
            self::CANDIDATE_STATUS_DRAFT,
            self::CANDIDATE_STATUS_DRAFT_EXPIRED,
            self::CANDIDATE_STATUS_NEW_APPLICATION,
            self::CANDIDATE_STATUS_APPLICATION_REVIEW,
            self::CANDIDATE_STATUS_SCREENED_IN,
            self::CANDIDATE_STATUS_SCREENED_OUT_APPLICATION,
            self::CANDIDATE_STATUS_UNDER_ASSESSMENT,
            self::CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT,
            self::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            self::CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE,
            self::CANDIDATE_STATUS_QUALIFIED_WITHDREW,
            self::CANDIDATE_STATUS_PLACED_CASUAL,
            self::CANDIDATE_STATUS_PLACED_TERM,
            self::CANDIDATE_STATUS_PLACED_INDETERMINATE,
            self::CANDIDATE_STATUS_EXPIRED,
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

    const WORK_REGION_TELEWORK = 'TELEWORK';
    const WORK_REGION_NATIONAL_CAPITAL = 'NATIONAL_CAPITAL';
    const WORK_REGION_ATLANTIC = 'ATLANTIC';
    const WORK_REGION_QUEBEC = 'QUEBEC';
    const WORK_REGION_ONTARIO = 'ONTARIO';
    const WORK_REGION_PRAIRIE = 'PRAIRIE';
    const WORK_REGION_BRITISH_COLUMBIA = 'BRITISH_COLUMBIA';
    const WORK_REGION_NORTH = 'NORTH';
    /**
     * A collection of enums for WorkRegions in factories and seeders
     *
     * @return string[]
     */
    public static function workRegions() : array
    {
        return [
            self::WORK_REGION_TELEWORK,
            self::WORK_REGION_NATIONAL_CAPITAL,
            self::WORK_REGION_ATLANTIC,
            self::WORK_REGION_QUEBEC,
            self::WORK_REGION_ONTARIO,
            self::WORK_REGION_PRAIRIE,
            self::WORK_REGION_BRITISH_COLUMBIA,
            self::WORK_REGION_NORTH,
        ];
    }

    /**
     * Pool Advertisement statuses
     */
    const POOL_ADVERTISEMENT_IS_DRAFT = 'DRAFT';
    const POOL_ADVERTISEMENT_IS_PUBLISHED = 'PUBLISHED';
    const POOL_ADVERTISEMENT_IS_EXPIRED = 'EXPIRED';
    public static function poolAdvertisementStatuses() : array
    {
        return [
            self::POOL_ADVERTISEMENT_IS_DRAFT,
            self::POOL_ADVERTISEMENT_IS_PUBLISHED,
            self::POOL_ADVERTISEMENT_IS_EXPIRED,
        ];
    }

    /**
     * Pool Advertisement languages
     */
    const POOL_ADVERTISEMENT_ENGLISH = 'ENGLISH';
    const POOL_ADVERTISEMENT_FRENCH = 'FRENCH';
    const POOL_ADVERTISEMENT_VARIOUS = 'VARIOUS';
    const POOL_ADVERTISEMENT_BILINGUAL_INTERMEDIATE = 'BILINGUAL_INTERMEDIATE';
    const POOL_ADVERTISEMENT_BILINGUAL_ADVANCED = 'BILINGUAL_ADVANCED';
    public static function poolAdvertisementLanguages() : array
    {
        return [
            self::POOL_ADVERTISEMENT_ENGLISH,
            self::POOL_ADVERTISEMENT_FRENCH,
            self::POOL_ADVERTISEMENT_VARIOUS,
            self::POOL_ADVERTISEMENT_BILINGUAL_INTERMEDIATE,
            self::POOL_ADVERTISEMENT_BILINGUAL_ADVANCED,
        ];
    }

    /**
     * Pool Advertisement security clearances
     */
    const POOL_ADVERTISEMENT_RELIABILITY = 'RELIABILITY';
    const POOL_ADVERTISEMENT_SECRET = 'SECRET';
    const POOL_ADVERTISEMENT_TOP_SECRET = 'TOP_SECRET';
    public static function poolAdvertisementSecurity() : array
    {
        return [
            self::POOL_ADVERTISEMENT_RELIABILITY,
            self::POOL_ADVERTISEMENT_SECRET,
            self::POOL_ADVERTISEMENT_TOP_SECRET,
        ];
    }

    /**
     * Citizenship
     */
    const CITIZENSHIP_CITIZEN = 'CITIZEN';
    const CITIZENSHIP_PR = 'PERMANENT_RESIDENT';
    const CITIZENSHIP_OTHER = 'OTHER';
    public static function citizenshipStatuses() : array
    {
        return [
            self::CITIZENSHIP_CITIZEN,
            self::CITIZENSHIP_PR,
            self::CITIZENSHIP_OTHER,
        ];
    }

    /**
     * CAF Status
     */
    const ARMED_FORCES_VETERAN = 'VETERAN';
    const ARMED_FORCES_MEMBER = 'MEMBER';
    const ARMED_FORCES_NON_CAF = 'NON_CAF';
    public static function armedForcesStatuses() : array
    {
        return [
            self::ARMED_FORCES_VETERAN,
            self::ARMED_FORCES_MEMBER,
            self::ARMED_FORCES_NON_CAF,
        ];
    }

    /**
     * Computed Priority Status
     */
    const PRIORITY_DERIVED_PRIORITY = 'PRIORITY';
    const PRIORITY_DERIVED_VETERAN = 'VETERAN';
    const PRIORITY_DERIVED_CITIZEN_OR_PR = 'CITIZEN_OR_PR';
    const PRIORITY_DERIVED_OTHER = 'OTHER';
    public static function priorityDerivedStatuses() : array
    {
        return [
            self::PRIORITY_DERIVED_PRIORITY,
            self::PRIORITY_DERIVED_VETERAN,
            self::PRIORITY_DERIVED_CITIZEN_OR_PR,
            self::PRIORITY_DERIVED_OTHER,
        ];
    }
}
